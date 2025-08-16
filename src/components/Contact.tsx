import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import emailjs from '@emailjs/browser';
import { personalInfoApi } from '../services/api';
import { PersonalInfo } from '../types';

// EmailJS configuration - using environment variables only
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

const Contact: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const response = await personalInfoApi.get();
        setPersonalInfo(response.data);
      } catch (error) {
        console.error('Error fetching personal info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Check if EmailJS is properly configured
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.error('EmailJS configuration missing. Using mailto fallback.');
      setSubmitStatus('error');
      setErrorMessage('Email service not configured. Using direct email fallback.');
      setTimeout(() => {
        handleMailtoFallback();
      }, 2000);
      setIsSubmitting(false);
      return;
    }

    if (form.current) {
      try {
        // Get form data and prepare JSON object
        const formData = new FormData(form.current);
        const templateParams = {
          from_name: formData.get('from_name') as string,
          from_email: formData.get('from_email') as string,
          subject: formData.get('subject') as string,
          message: formData.get('message') as string,
          to_email: personalInfo?.email || process.env.REACT_APP_CONTACT_EMAIL || 'alan.kalbermatter.dev@gmail.com',
          reply_to: formData.get('from_email') as string,
        };

        // Debug: Log what we're about to send
        console.log('=== DEBUGGING EMAILJS REQUEST ===');
        console.log('SERVICE_ID:', EMAILJS_SERVICE_ID);
        console.log('TEMPLATE_ID:', EMAILJS_TEMPLATE_ID);
        console.log('PUBLIC_KEY:', EMAILJS_PUBLIC_KEY);
        console.log('Template params:');
        console.log(JSON.stringify(templateParams, null, 2));

        const result = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );

        console.log('Email sent successfully:', result.text);
        setSubmitStatus('success');
        form.current.reset(); // Reset the form after success

      } catch (error: any) {
        console.error('Failed to send email:', error);
        setSubmitStatus('error');
        setErrorMessage(error.text || 'EmailJS service failed. Using email client fallback.');

        // Auto-fallback to mailto after showing error briefly
        setTimeout(() => {
          handleMailtoFallback();
        }, 2000);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Alternative: Simple mailto fallback
  const handleMailtoFallback = () => {
    if (form.current) {
      const formData = new FormData(form.current);
      const name = formData.get('from_name') as string;
      const email = formData.get('from_email') as string;
      const subject = formData.get('subject') as string;
      const message = formData.get('message') as string;

      const mailtoSubject = encodeURIComponent(subject || 'Portfolio Contact');
      const mailtoBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );
      const mailtoUrl = `mailto:${personalInfo?.email || 'alan.kalbermatter.dev@gmail.com'}?subject=${mailtoSubject}&body=${mailtoBody}`;
      window.location.href = mailtoUrl;
    }
  };

  if (loading) {
    return (
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-16"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            I'm always interested in new opportunities and collaborations.
            Let's discuss how we can work together!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send me a message</h3>

              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="from_name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="from_email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                      placeholder="alan.kalbermatter.dev@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell me about your project or just say hello!"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>

                {/* Fallback mailto button */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleMailtoFallback}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium underline transition-colors"
                  >
                    Or send email directly with your email client
                  </button>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    ✅ Message sent successfully! I'll get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    ❌ Something went wrong. Please try again or contact me directly.
                  </div>
                )}

                {/* Error Message for EmailJS */}
                {submitStatus === 'error' && errorMessage && (
                  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    ❌ {errorMessage}
                  </div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <p className="text-gray-600 mb-8">
                Feel free to reach out through any of these channels. I typically respond within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <a
                    href={`mailto:${personalInfo?.email}`}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {personalInfo?.email || 'alan.kalbermatter.dev@gmail.com'}
                  </a>
                </div>
              </div>

              {/* Phone */}
              {personalInfo?.phone && (
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <PhoneIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <a
                      href={`tel:${personalInfo.phone}`}
                      className="text-gray-600 hover:text-green-600 transition-colors"
                    >
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPinIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Location</h4>
                  <p className="text-gray-600">
                    {personalInfo?.location || 'Remote'}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Connect with me</h4>
              <div className="flex space-x-4">
                {personalInfo?.githubUrl && (
                  <a
                    href={personalInfo.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}

                {personalInfo?.linkedinUrl && (
                  <a
                    href={personalInfo.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-200 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}

                {personalInfo?.twitterUrl && (
                  <a
                    href={personalInfo.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 hover:text-sky-700 hover:bg-sky-200 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
