import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const event = await prisma.courseEvent.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Format date for iCal (YYYYMMDDTHHMMSSZ)
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    // Escape special characters for iCal
    const escapeText = (text: string) => {
      return text
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n')
    }

    const instructorName = `${event.instructor.firstName || ''} ${event.instructor.lastName || ''}`.trim()
    const description = event.description
      ? escapeText(event.description)
      : ''
    const courseInfo = event.course
      ? `\\n\\nPart of course: ${escapeText(event.course.title)}`
      : ''

    // Build iCal content
    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//GrowShare//Knowledge Hub//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id}@growshare.co`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(event.startTime)}`,
      `DTEND:${formatDate(event.endTime)}`,
      `SUMMARY:${escapeText(event.title)}`,
      `DESCRIPTION:${description}${courseInfo}\\n\\nHost: ${escapeText(instructorName)}`,
      event.meetingUrl ? `URL:${event.meetingUrl}` : null,
      `ORGANIZER;CN=${escapeText(instructorName)}:mailto:${event.instructor.email || 'noreply@growshare.co'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ]
      .filter(Boolean)
      .join('\r\n')

    // Return as downloadable .ics file
    return new NextResponse(icalContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics"`,
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate calendar file' },
      { status: 500 }
    )
  }
}
