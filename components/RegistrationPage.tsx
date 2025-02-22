// components/RegistrationPage.tsx

"use client";

import React, { useState } from 'react';
import Script from 'next/script';
import { Loader2 } from 'lucide-react';

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
  const handleSuccessfulPayment = async (paymentResponse) => {
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

  const handleInputChange = async (e) => {
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

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment failed:', error);
      alert(error.message);
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
                href="https://whatsapp.group/example"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
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
                Address
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
                Phone Number
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
  );
};

export default RegistrationPage;