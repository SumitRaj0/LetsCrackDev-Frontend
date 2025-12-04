import { Link } from 'react-router-dom'
import { SocialLinks } from '@/components/shared/SocialLinks'
import { COMPANY_INFO } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-100 mt-auto relative">
      {/* Top gradient strip */}
      <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Block */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {/* Fixed-height wrapper so layout height stays stable */}
              <div className="h-12 flex items-center overflow-visible">
                <img
                  src="/letscrackdev-logo.png"
                  alt="LetsCrackDev logo"
                  className="h-40 w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Crack the Code. Build the Future.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-slate-100 mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-slate-100 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-slate-400 hover:text-slate-100 transition-colors text-sm"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-slate-400 hover:text-slate-100 transition-colors text-sm"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/premium"
                  className="text-slate-400 hover:text-slate-100 transition-colors text-sm"
                >
                  Premium
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-slate-100 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-slate-400 hover:text-slate-100 transition-colors text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-slate-400 hover:text-slate-100 transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-slate-400 hover:text-slate-100 transition-colors text-sm"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-400 hover:text-slate-100 transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-semibold text-slate-100 mb-4">Follow Us</h3>
            <SocialLinks />
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8">
          <p className="text-slate-400 text-sm text-center">
            &copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
