// Lease Agreement Generator
// This module generates PDF lease agreements for plot bookings

interface LeaseData {
  bookingId: string
  // Renter Info
  renterName: string
  renterEmail: string
  renterAddress?: string
  // Owner Info
  ownerName: string
  ownerEmail: string
  ownerAddress?: string
  // Plot Info
  plotTitle: string
  plotAddress: string
  plotCity: string
  plotState: string
  plotZipCode: string
  plotAcreage: number
  // Booking Details
  startDate: Date
  endDate: Date
  monthlyRate: number
  totalAmount: number
  securityDeposit?: number
  // Terms
  plotRules?: string[]
  restrictions?: string
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Generate lease agreement HTML (can be converted to PDF)
export function generateLeaseHTML(data: LeaseData): string {
  const today = formatDate(new Date())
  const startDate = formatDate(data.startDate)
  const endDate = formatDate(data.endDate)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Land Use Agreement - ${data.plotTitle}</title>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.6;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 1in;
      color: #333;
    }
    h1 {
      text-align: center;
      font-size: 18pt;
      margin-bottom: 1.5em;
      text-transform: uppercase;
    }
    h2 {
      font-size: 14pt;
      margin-top: 1.5em;
      border-bottom: 1px solid #333;
      padding-bottom: 0.25em;
    }
    .header {
      text-align: center;
      margin-bottom: 2em;
    }
    .date {
      text-align: right;
      margin-bottom: 1em;
    }
    .parties {
      margin: 2em 0;
    }
    .party {
      margin-bottom: 1em;
    }
    .property-details {
      background-color: #f5f5f5;
      padding: 1em;
      margin: 1em 0;
      border-radius: 4px;
    }
    .section {
      margin: 1.5em 0;
    }
    .clause {
      margin: 1em 0;
      text-align: justify;
    }
    .clause-title {
      font-weight: bold;
    }
    .signature-block {
      margin-top: 3em;
      page-break-inside: avoid;
    }
    .signature-line {
      display: flex;
      justify-content: space-between;
      margin-top: 3em;
    }
    .signature {
      width: 45%;
    }
    .signature-field {
      border-bottom: 1px solid #333;
      padding: 0.5em 0;
      margin-bottom: 0.5em;
    }
    .signature-label {
      font-size: 10pt;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
    }
    th, td {
      padding: 0.5em;
      text-align: left;
      border: 1px solid #ddd;
    }
    th {
      background-color: #f0f0f0;
    }
    .footer {
      margin-top: 2em;
      font-size: 10pt;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Land Use Agreement</h1>
    <p><strong>GrowShare - Community Land Sharing</strong></p>
  </div>

  <div class="date">
    <p>Agreement Date: ${today}</p>
    <p>Agreement ID: ${data.bookingId}</p>
  </div>

  <div class="parties">
    <h2>Parties</h2>
    <div class="party">
      <p><strong>LANDOWNER ("Owner"):</strong></p>
      <p>${data.ownerName}<br>
      Email: ${data.ownerEmail}
      ${data.ownerAddress ? `<br>Address: ${data.ownerAddress}` : ''}</p>
    </div>
    <div class="party">
      <p><strong>LAND USER ("Renter"):</strong></p>
      <p>${data.renterName}<br>
      Email: ${data.renterEmail}
      ${data.renterAddress ? `<br>Address: ${data.renterAddress}` : ''}</p>
    </div>
  </div>

  <div class="section">
    <h2>Property Description</h2>
    <div class="property-details">
      <table>
        <tr>
          <th>Property Name</th>
          <td>${data.plotTitle}</td>
        </tr>
        <tr>
          <th>Address</th>
          <td>${data.plotAddress}, ${data.plotCity}, ${data.plotState} ${data.plotZipCode}</td>
        </tr>
        <tr>
          <th>Size</th>
          <td>${data.plotAcreage} acres</td>
        </tr>
      </table>
    </div>
  </div>

  <div class="section">
    <h2>Term and Payment</h2>
    <table>
      <tr>
        <th>Lease Period</th>
        <td>${startDate} to ${endDate}</td>
      </tr>
      <tr>
        <th>Monthly Rate</th>
        <td>${formatCurrency(data.monthlyRate)}</td>
      </tr>
      <tr>
        <th>Total Amount</th>
        <td>${formatCurrency(data.totalAmount)}</td>
      </tr>
      ${data.securityDeposit ? `
      <tr>
        <th>Security Deposit</th>
        <td>${formatCurrency(data.securityDeposit)} (Refundable)</td>
      </tr>
      ` : ''}
    </table>
  </div>

  <div class="section">
    <h2>Terms and Conditions</h2>

    <div class="clause">
      <span class="clause-title">1. Purpose of Use.</span>
      The Renter agrees to use the property solely for agricultural purposes, including but not limited to gardening, farming, and cultivation of crops. The Renter shall not use the property for any illegal purposes or in any manner that would be harmful to the land.
    </div>

    <div class="clause">
      <span class="clause-title">2. Condition of Property.</span>
      The Renter acknowledges that they have inspected the property and accepts it in its current condition. The Renter agrees to maintain the property in good condition and return it in substantially the same condition at the end of the lease term, normal wear and tear excepted.
    </div>

    <div class="clause">
      <span class="clause-title">3. Insurance and Liability.</span>
      The Renter is responsible for obtaining adequate liability insurance for their activities on the property. The Owner is not liable for any injuries or damages that may occur to the Renter, their guests, or their property while on the premises, except in cases of Owner negligence.
    </div>

    <div class="clause">
      <span class="clause-title">4. Access.</span>
      The Owner grants the Renter reasonable access to the property during daylight hours. Any modifications to access arrangements must be agreed upon by both parties in writing.
    </div>

    <div class="clause">
      <span class="clause-title">5. Improvements.</span>
      The Renter shall not make any permanent improvements to the property without the prior written consent of the Owner. Any approved improvements become the property of the Owner at the end of the lease term unless otherwise agreed.
    </div>

    <div class="clause">
      <span class="clause-title">6. Environmental Compliance.</span>
      The Renter agrees to comply with all applicable environmental laws and regulations. The Renter shall not use any prohibited pesticides or chemicals and agrees to follow organic or sustainable practices as required by local regulations.
    </div>

    <div class="clause">
      <span class="clause-title">7. Payment Terms.</span>
      Payment is due on the first day of each month. Payments are processed through the GrowShare platform. Late payments may result in additional fees as outlined in the GrowShare Terms of Service.
    </div>

    ${data.restrictions ? `
    <div class="clause">
      <span class="clause-title">8. Additional Restrictions.</span>
      ${data.restrictions}
    </div>
    ` : ''}

    <div class="clause">
      <span class="clause-title">${data.restrictions ? '9' : '8'}. Termination.</span>
      Either party may terminate this agreement with 30 days written notice. In case of material breach, the non-breaching party may terminate immediately upon written notice. The security deposit will be returned within 14 days of termination, less any deductions for damages or unpaid rent.
    </div>

    <div class="clause">
      <span class="clause-title">${data.restrictions ? '10' : '9'}. Dispute Resolution.</span>
      Any disputes arising from this agreement shall first be addressed through GrowShare's dispute resolution process. If unresolved, disputes shall be settled through binding arbitration in accordance with the laws of the state where the property is located.
    </div>

    <div class="clause">
      <span class="clause-title">${data.restrictions ? '11' : '10'}. Entire Agreement.</span>
      This agreement, together with the GrowShare Terms of Service, constitutes the entire agreement between the parties. Any modifications must be made in writing and agreed to by both parties through the GrowShare platform.
    </div>
  </div>

  <div class="signature-block">
    <h2>Signatures</h2>
    <p>By signing below (or accepting electronically through the GrowShare platform), both parties agree to the terms and conditions outlined in this agreement.</p>

    <div class="signature-line">
      <div class="signature">
        <div class="signature-field">&nbsp;</div>
        <p class="signature-label">Landowner Signature</p>
        <p>${data.ownerName}</p>
        <p class="signature-label">Date: ________________</p>
      </div>
      <div class="signature">
        <div class="signature-field">&nbsp;</div>
        <p class="signature-label">Renter Signature</p>
        <p>${data.renterName}</p>
        <p class="signature-label">Date: ________________</p>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>This agreement was generated through GrowShare (growshare.com)</p>
    <p>Agreement ID: ${data.bookingId} | Generated: ${today}</p>
  </div>
</body>
</html>
`
}

// Store lease data for a booking
export async function saveLeaseDocument(
  prisma: any,
  bookingId: string
): Promise<string> {
  // In a production environment, this would:
  // 1. Convert HTML to PDF using a service like Puppeteer or a PDF API
  // 2. Upload the PDF to cloud storage (Cloudinary, S3, etc.)
  // 3. Store the URL in the database

  // For now, we'll store the URL that serves the generated HTML
  const documentUrl = `/api/bookings/${bookingId}/lease`

  // Update booking with lease document reference
  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      leaseUrl: documentUrl,
    },
  })

  return documentUrl
}

// Get lease data from a booking
export async function getLeaseDataFromBooking(
  prisma: any,
  bookingId: string
): Promise<LeaseData | null> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      plot: {
        select: {
          title: true,
          address: true,
          city: true,
          state: true,
          zipCode: true,
          acreage: true,
          restrictions: true,
          owner: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              location: true,
            },
          },
        },
      },
      renter: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          location: true,
        },
      },
    },
  })

  if (!booking) return null

  return {
    bookingId: booking.id,
    renterName: `${booking.renter.firstName} ${booking.renter.lastName}`,
    renterEmail: booking.renter.email,
    renterAddress: booking.renter.location || undefined,
    ownerName: `${booking.plot.owner.firstName} ${booking.plot.owner.lastName}`,
    ownerEmail: booking.plot.owner.email,
    ownerAddress: booking.plot.owner.location || undefined,
    plotTitle: booking.plot.title,
    plotAddress: booking.plot.address || '',
    plotCity: booking.plot.city || '',
    plotState: booking.plot.state || '',
    plotZipCode: booking.plot.zipCode || '',
    plotAcreage: booking.plot.acreage || 0,
    startDate: booking.startDate,
    endDate: booking.endDate,
    monthlyRate: booking.monthlyRate,
    totalAmount: booking.totalAmount,
    securityDeposit: booking.securityDeposit || undefined,
    restrictions: booking.plot.restrictions || undefined,
  }
}
