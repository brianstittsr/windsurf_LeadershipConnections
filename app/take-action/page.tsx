'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function TakeAction() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data: any) => {
    // Here we'll implement the email functionality
    console.log(data)
  }

  return (
    <main className="min-h-screen py-8 md:py-12 bg-purple-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-800 mb-8 md:mb-12">Take Action</h1>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Membership Section */}
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Become a Member</h2>
            <p className="text-gray-600 mb-6">
              Join Leadership Connections and become part of a community dedicated to empowering young women. Experience mentorship, 
              leadership development, and networking opportunities that will shape your future.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">Access to exclusive workshops and events</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">One-on-one mentorship opportunities</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-2">Leadership development programs</span>
              </div>
            </div>
            <button className="w-full bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors mt-8">
              Join Now
            </button>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Send Us a Note</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="name">Name</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  type="text"
                  id="name"
                  placeholder="Your name"
                />
                {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message as string}</span>}
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="email">Email</label>
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email'
                    }
                  })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  type="email"
                  id="email"
                  placeholder="your.email@example.com"
                />
                {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message as string}</span>}
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="message">Message</label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  id="message"
                  rows={4}
                  placeholder="Your message..."
                />
                {errors.message && <span className="text-red-500 text-sm mt-1">{errors.message.message as string}</span>}
              </div>

              <button 
                type="submit"
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
