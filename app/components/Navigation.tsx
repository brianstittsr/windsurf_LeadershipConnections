'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed w-full bg-white z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/lcnclogo_1.jpeg"
                alt="Leadership Connections NC Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-semibold text-gray-900">LCNC</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="/programs" className="text-gray-600 hover:text-gray-900">Programs</Link>
            <Link href="/community-service" className="text-gray-600 hover:text-gray-900">Community Service</Link>
            <Link href="/honors" className="text-gray-600 hover:text-gray-900">Honors</Link>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/take-action"
              className="px-4 py-2 text-[#7C3AED] font-medium hover:text-purple-700"
            >
              Sign In
            </Link>
            <Link
              href="/take-action"
              className="px-4 py-2 bg-[#7C3AED] text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
            >
              Take Action
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white border-t">
          <Link
            href="/"
            className="block px-3 py-2 text-base text-gray-600 hover:text-gray-900"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block px-3 py-2 text-base text-gray-600 hover:text-gray-900"
          >
            About
          </Link>
          <Link
            href="/programs"
            className="block px-3 py-2 text-base text-gray-600 hover:text-gray-900"
          >
            Programs
          </Link>
          <Link
            href="/community-service"
            className="block px-3 py-2 text-base text-gray-600 hover:text-gray-900"
          >
            Community Service
          </Link>
          <Link
            href="/honors"
            className="block px-3 py-2 text-base text-gray-600 hover:text-gray-900"
          >
            Honors
          </Link>
          <div className="pt-4 flex flex-col space-y-2">
            <Link
              href="/take-action"
              className="px-4 py-2 text-center text-[#7C3AED] font-medium hover:text-purple-700"
            >
              Sign In
            </Link>
            <Link
              href="/take-action"
              className="px-4 py-2 text-center bg-[#7C3AED] text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
            >
              Take Action
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
