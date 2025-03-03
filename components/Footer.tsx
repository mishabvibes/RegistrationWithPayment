"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Footer = () => {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Animation on scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight;
            const footerPosition = document.getElementById('footer')?.offsetTop || 0;

            if (scrollPosition > footerPosition - 100) {
                setIsVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Check visibility on initial load
        setTimeout(handleScroll, 300);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const openModal = (modalId: string) => {
        setActiveModal(modalId);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setActiveModal(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <>
            <footer
                id="footer"
                className={`bg-slate-200 pt-16 pb-6 relative overflow-hidden transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0' }`}>
                {/* Decorative elements */}
                {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
                <div className="absolute top-0 left-1/4 w-24 h-24 bg-blue-100 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
                <div className="absolute top-10 right-1/3 w-36 h-36 bg-purple-100 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
                <div className="absolute bottom-10 left-1/3 w-48 h-48 bg-pink-50 rounded-full blur-3xl opacity-40 animate-pulse-slow"></div> */}

                {/* Floating decoration elements */}
                <div className="absolute top-20 left-10 animate-float" style={{ animationDelay: '0.5s' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="8" stroke="#E0F2FE" strokeWidth="2" />
                        <circle cx="12" cy="12" r="4" fill="#BAE6FD" />
                    </svg>
                </div>
                <div className="absolute top-32 right-16 animate-float" style={{ animationDelay: '1.2s' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="4" y="4" width="16" height="16" rx="2" stroke="#F5F3FF" strokeWidth="2" />
                        <rect x="8" y="8" width="8" height="8" fill="#DDD6FE" />
                    </svg>
                </div>
                <div className="absolute bottom-24 right-32 animate-float" style={{ animationDelay: '0.8s' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3L22 17H2L12 3Z" stroke="#FFEDD5" strokeWidth="2" />
                        <path d="M12 8L17 17H7L12 8Z" fill="#FED7AA" />
                    </svg>
                </div>
                <div className="absolute bottom-16 left-20 animate-float" style={{ animationDelay: '1.5s' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#FCE7F3" strokeWidth="2" />
                        <path d="M12 7L13.5 10.5L17.5 11L14.75 13.5L15.5 17.5L12 15.5L8.5 17.5L9.25 13.5L6.5 11L10.5 10.5L12 7Z" fill="#FBCFE8" />
                    </svg>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                        {/* Logo and company info */}
                        <div className="md:col-span-4">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">DIGIBAYT</h2>
                                <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full"></div>
                            </div>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Providing exceptional IT-related services, including web design, development,
                                marketing solutions and digital transformation for businesses of all sizes.
                            </p>
                            <div className="flex items-center space-x-4">
                                <a
                                    href="mailto:hi@digibayt.com"
                                    className="text-gray-600 hover:text-blue-500 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                    </svg>
                                    hi@digibayt.com
                                </a>
                            </div>
                            <div className="mt-2">
                                <a
                                    href="tel:+919074433100"
                                    className="text-gray-600 hover:text-blue-500 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                    </svg>
                                    +91 9074433100
                                </a>
                            </div>
                        </div>

                        {/* Quick links */}
                        <div className="md:col-span-3 md:ml-auto">
                            <h3 className="text-lg font-semibold text-gray-800 mb-5">Quick Links</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        href="/"
                                        className="text-gray-600 hover:text-blue-500 transition-colors relative group"
                                    >
                                        Home
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() => openModal('privacy')}
                                        className="text-gray-600 hover:text-blue-500 transition-colors relative group bg-transparent border-none p-0 font-normal text-left"
                                    >
                                        Privacy Policy
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => openModal('refund')}
                                        className="text-gray-600 hover:text-blue-500 transition-colors relative group bg-transparent border-none p-0 font-normal text-left"
                                    >
                                        Cancellation & Refund
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => openModal('terms')}
                                        className="text-gray-600 hover:text-blue-500 transition-colors relative group bg-transparent border-none p-0 font-normal text-left"
                                    >
                                        Terms & Conditions
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Social connect */}
                        <div className="md:col-span-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-5">Connect With Us</h3>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Follow us on social media to stay updated with our latest projects and announcements.
                            </p>
                            <div className="flex space-x-3">
                                <a
                                    href="https://www.facebook.com/alathoorpadidars/"
                                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-500 hover:text-white transform hover:scale-110 transition-all"
                                    aria-label="Facebook"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.instagram.com/alathurpadi_dars/"
                                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-pink-500 hover:text-white transform hover:scale-110 transition-all"
                                    aria-label="Instagram"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.youtube.com/c/ALATHURPADIDARS/playlists"
                                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-500 hover:text-white transform hover:scale-110 transition-all"
                                    aria-label="YouTube"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-500 text-sm">
                                © {new Date().getFullYear()} DIGIBAYT. All rights reserved.
                            </p>
                            <div className="mt-4 md:mt-0">
                                <div className="inline-flex items-center">
                                    <span className="text-sm text-gray-500 mr-2">Made with</span>
                                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                                    </svg>
                                    <span className="text-sm text-gray-500 ml-2">in India</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back to top button */}
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="absolute bottom-10 right-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-500 hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                        </svg>
                    </button>
                </div>
            </footer>

            {/* Privacy Policy Modal */}
            {activeModal === 'privacy' && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-modalFadeIn modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Privacy Policy</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="prose max-w-none text-gray-700">
                                <p><strong>Last Updated: 18 Feb 2025</strong></p>
                                <p>DIGIBAYT (&quotwe,&quot &quotour,&quot or &quotus&quot) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website <a href="https://www.digibayt.com" className="text-blue-500 hover:text-blue-700">www.digibayt.com</a> or use our services.</p>

                                <h3 className="text-gray-800 mt-6 mb-3">1. Information We Collect</h3>
                                <ul className="space-y-1">
                                    <li>Personal information (name, email, phone number, address, etc.)</li>
                                    <li>Payment details when purchasing our services</li>
                                    <li>Cookies and usage data for website improvements</li>
                                </ul>

                                <h3 className="text-gray-800 mt-6 mb-3">2. How We Use Your Information</h3>
                                <ul className="space-y-1">
                                    <li>To provide and improve our services</li>
                                    <li>To process payments securely</li>
                                    <li>To communicate updates, offers, or inquiries</li>
                                    <li>To comply with legal requirements</li>
                                </ul>

                                <h3 className="text-gray-800 mt-6 mb-3">3. Data Protection</h3>
                                <p>We implement industry-standard security measures to protect your data. However, we are not liable for unauthorized access beyond our control.</p>

                                <h3 className="text-gray-800 mt-6 mb-3">4. Third-Party Services</h3>
                                <p>We may use third-party payment gateways (e.g., Razorpay) to process transactions securely. Their privacy policies apply.</p>

                                <h3 className="text-gray-800 mt-6 mb-3">5. Your Rights</h3>
                                <p>You can request access, correction, or deletion of your data by contacting us at <a href="mailto:hi@digibayt.com" className="text-blue-500 hover:text-blue-700">hi@digibayt.com</a>.</p>

                                <h3 className="text-gray-800 mt-6 mb-3">6. Updates to This Policy</h3>
                                <p>We may update this Privacy Policy periodically. The latest version will always be available on our website.</p>

                                <p className="mt-6">For any queries, contact us at <a href="tel:+919074433100" className="text-blue-500 hover:text-blue-700">+91 9074433100</a>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancellation and Refund Policy Modal */}
            {activeModal === 'refund' && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-modalFadeIn modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Cancellation and Refund Policy</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="prose max-w-none text-gray-700">
                                <p><strong>Last Updated: 18 Feb 2025</strong></p>

                                <h3 className="text-gray-800 mt-6 mb-3">1. Cancellation Policy</h3>
                                <ul className="space-y-1">
                                    <li>Cancellation requests must be made within <strong>24 hours of purchase</strong>.</li>
                                    <li>If the service has already commenced, cancellation may not be possible.</li>
                                </ul>

                                <h3 className="text-gray-800 mt-6 mb-3">2. Refund Policy</h3>
                                <ul className="space-y-1">
                                    <li>Refunds will be processed within <strong>5 business days</strong> of approval.</li>
                                    <li>Refunds are only applicable if services cannot be provided as agreed.</li>
                                    <li>No refunds will be issued for services already rendered or partially completed.</li>
                                </ul>

                                <h3 className="text-gray-800 mt-6 mb-3">3. How to Request a Refund</h3>
                                <p>To request a refund, email us at <a href="mailto:hi@digibayt.com" className="text-blue-500 hover:text-blue-700">hi@digibayt.com</a> with details of your order.</p>

                                <p className="mt-6">For any queries, contact us at <a href="tel:+919074433100" className="text-blue-500 hover:text-blue-700">+91 9074433100</a>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Terms and Conditions Modal */}
            {activeModal === 'terms' && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-modalFadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Terms and Conditions</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="prose max-w-none text-gray-700">
                                <p><strong>Last Updated: 18 Feb 2025</strong></p>

                                <h3 className="text-gray-800 mt-6 mb-3">1. Services</h3>
                                <p>DIGIBAYT offers IT-related services, including web design, development, marketing, and digital solutions.</p>

                                <h3 className="text-gray-800 mt-6 mb-3">2. Payment & Billing</h3>
                                <ul className="space-y-1">
                                    <li>Payments must be made in full before service commencement.</li>
                                    <li>We use Razorpay for secure transactions.</li>
                                </ul>

                                <h3 className="text-gray-800 mt-6 mb-3">3. Intellectual Property</h3>
                                <p>All designs, content, and digital assets created by DIGIBAYT remain our intellectual property unless explicitly transferred.</p>

                                <h3 className="text-gray-800 mt-6 mb-3">4. Limitation of Liability</h3>
                                <p>We are not liable for indirect, incidental, or consequential damages arising from the use of our services.</p>

                                <h3 className="text-gray-800 mt-6 mb-3">5. Governing Law</h3>
                                <p>These terms are governed by the laws of <strong>India</strong>.</p>

                                <p className="mt-6">For any inquiries, contact <a href="mailto:hi@digibayt.com" className="text-blue-500 hover:text-blue-700">hi@digibayt.com</a> or <a href="tel:+919074433100" className="text-blue-500 hover:text-blue-700">+91 9074433100</a>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Footer;