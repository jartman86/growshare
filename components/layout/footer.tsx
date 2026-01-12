import Link from 'next/link'
import { Sprout } from 'lucide-react'

const footerNavigation = {
  platform: [
    { name: 'Explore Plots', href: '/explore' },
    { name: 'List Your Land', href: '/list-plot' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Knowledge Hub', href: '/knowledge' },
  ],
  community: [
    { name: 'Community Forum', href: '/community' },
    { name: 'Success Stories', href: '/stories' },
    { name: 'Events', href: '/events' },
    { name: 'Blog', href: '/blog' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Partner With Us', href: '/partners' },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Lease Templates', href: '/legal/leases' },
    { name: 'Insurance', href: '/insurance' },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t-2 border-[#8bc34a]/30 topo-dense bg-gradient-to-br from-[#f4e4c1] via-white to-[#aed581]/30">
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <Sprout className="h-8 w-8 text-[#4a7c2c] transition-transform group-hover:scale-110 group-hover:rotate-12" />
              <span className="text-xl font-bold bg-gradient-to-r from-[#2d5016] to-[#4a7c2c] bg-clip-text text-transparent">GrowShare</span>
            </Link>
            <p className="text-sm text-[#4a3f35] max-w-xs font-medium">
              Transforming land into opportunity. Building thriving agricultural communities through connection, education, and shared growth.
            </p>
            <div className="flex space-x-4">
              {/* Social Links - Add your social media */}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-[#2d5016] mb-1">Platform</h3>
                <ul className="mt-4 space-y-3">
                  {footerNavigation.platform.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-[#4a3f35] hover:text-[#4a7c2c] transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-[#2d5016] mb-1">Community</h3>
                <ul className="mt-4 space-y-3">
                  {footerNavigation.community.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-[#4a3f35] hover:text-[#4a7c2c] transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-[#2d5016] mb-1">Support</h3>
                <ul className="mt-4 space-y-3">
                  {footerNavigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-[#4a3f35] hover:text-[#4a7c2c] transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-[#2d5016] mb-1">Legal</h3>
                <ul className="mt-4 space-y-3">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-[#4a3f35] hover:text-[#4a7c2c] transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t-2 border-[#8bc34a]/20 pt-8">
          <p className="text-sm text-[#4a3f35] text-center font-medium">
            &copy; {new Date().getFullYear()} GrowShare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
