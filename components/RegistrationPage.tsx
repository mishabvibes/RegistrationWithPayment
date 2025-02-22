"use client";

import React, { useState } from 'react';
import Script from 'next/script';
import { Loader2 } from 'lucide-react';

// Define the type for Razorpay payment response
type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

const RegistrationPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationCode, setRegistrationCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    address: '',
    phone: ''
  });

  // Generate a unique registration code
  const generateUniqueCode = async () => {
    while (true) {
      const code = 'RQ' + Math.floor(Math.random() * 9000 + 1000); // 4 digit number (1000-9999)
      
      // Check if code exists
      const response = await fetch('/api/check-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      
      const data = await response.json();
      if (!data.exists) {
        return code;
      }
    }
  };

  // Handle successful payment and registration
  const handleSuccessfulPayment = async (paymentResponse: RazorpayPaymentResponse) => {
    setIsPaymentComplete(true);
    
    try {
      // Generate unique registration code
      const code = await generateUniqueCode();
      
      // Save registration data
      const response = await fetch('/api/save-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentId: paymentResponse.razorpay_payment_id,
          registrationCode: code
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save registration');
      }

      setRegistrationCode(code);
      
      // Add a slight delay before showing success screen
      setTimeout(() => {
        setShowSuccess(true);
        setIsPaymentComplete(false);
      }, 1500);

    } catch (error) {
      console.error('Registration error:', error);
      alert('Payment successful but registration failed. Please contact support.');
      setIsPaymentComplete(false);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      address: '',
      phone: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check for duplicate phone number
    if (name === 'phone' && value.length === 10) {
      try {
        const response = await fetch('/api/check-duplicate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: value })
        });
        
        const data = await response.json();
        if (data.exists) {
          setErrors(prev => ({
            ...prev,
            phone: 'This phone number is already registered'
          }));
        }
      } catch (error) {
        console.error('Error checking duplicate:', error);
      }
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const data = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 70 * 100,
        currency: 'INR',
        name: 'Your Company Name',
        description: 'Registration Fee',
        order_id: data.orderId,
        handler: handleSuccessfulPayment,
        prefill: {
          name: formData.name,
          contact: formData.phone,
        },
        theme: {
          color: '#0F172A'
        }
      };

      if (typeof window !== 'undefined' && window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        console.error('Razorpay is not available');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unexpected error occurred.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(registrationCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  // Show success screen
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-lg shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
              Registration Successful! 🎉
            </h2>
  
            <div className="text-center mb-8">
              <p className="text-5xl font-bold text-slate-800 mb-4">
                {registrationCode}
              </p>
              <p className="text-sm text-slate-600 mb-4">Your Registration Code</p>
              <button
                onClick={handleCopyCode}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                {isCopied ? "Copied! ✅" : "Copy Code"}
              </button>
            </div>
  
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200 shadow-inner">
              <p className="text-center text-sm text-green-800 mb-4">
                Join our WhatsApp group using this link:
              </p>
              <a
                href="https://chat.whatsapp.com/FlQKNJqgbisLF3LvDw5ZaD"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                Click to Join WhatsApp Group →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show payment processing screen
  if (isPaymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mb-4 mx-auto" />
          <p className="text-white text-lg">Completing your registration...</p>
        </div>
      </div>
    );
  }

  // Show registration form
  return (
    <div className="min-h-screen bg-slate-200">
      {/* Home Page Section (Hero Section) */}
      <div className="h-screen flex flex-col items-center justify-center text-center pt-2 p-4 bg-[#2D6CCB] relative overflow-hidden">
        {/* Background Blur Effect */}
        <div className="absolute inset-0 bg-[url('/images/abstract-background.jpg')] bg-cover bg-center blur-sm opacity-20"></div>
  
        {/* Replace Logo and Heading with a PNG Image */}
        <img
          src="/img.png" // Replace with your PNG image path
          alt="Hero Image"
          className="w-full max-w-xl mb-0 z-10" // Adjust size as needed
        />
  
        {/* Subheadline */}
        <p className="text-xl text-slate-300 mb-8 z-10 leading-tight">
        Welcome to the Miskunnusook quiz this Ramadan on our Dars website! Test your knowledge with essays from Darshanam Online Magazine and compete for ₹25,000 in prizes. Top prize is ₹15,000, second prize ₹7,777. Good luck to all!
        </p>
  
        {/* Call-to-Action Button */}
        <button
          onClick={() => {
            const formElement = document.getElementById("registration-form");
            if (formElement) {
              formElement.scrollIntoView({ behavior: "smooth" });
            }
          }}          
          className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-300 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 z-10"
        >
          Get Started
        </button>
  
        {/* Animated Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute w-64 h-64 bg-purple-500/20 rounded-full -top-32 -left-32 animate-pulse"></div>
          <div className="absolute w-48 h-48 bg-pink-500/20 rounded-full -bottom-24 -right-24 animate-pulse"></div>
        </div>
      </div>
  
      {/* Registration Form Section */}
      <div id="registration-form" className="w-full flex items-center justify-center p-4 -mt-20 z-20 relative shadow-lg">
        <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-lg shadow-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
              Registration Form
            </h2>
  
            <div className="space-y-6">
              <div className="space-y-2">
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-slate-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-slate-400`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
  
              <div className="space-y-2">
                <label 
                  htmlFor="address" 
                  className="block text-sm font-medium text-slate-700"
                >
                  Place
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.address ? 'border-red-500' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-slate-400`}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                )}
              </div>
  
              <div className="space-y-2">
                <label 
                  htmlFor="phone" 
                  className="block text-sm font-medium text-slate-700"
                >
                  Whatsapp Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.phone ? 'border-red-500' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-slate-400`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
  
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-slate-900 text-white py-2 px-4 rounded-lg font-medium
                  hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400
                  disabled:bg-slate-400 disabled:cursor-not-allowed
                  transition-colors duration-200 ease-in-out"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </div>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
  
      {/* Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Razorpay script loaded');
        }}
      />
    </div>
  );
};

export default RegistrationPage;