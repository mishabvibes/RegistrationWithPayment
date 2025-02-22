"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Search, Download, Phone, User, MapPin, CreditCard } from 'lucide-react';

// Define the type for a registration object
type Registration = {
  registrationCode: string;
  name: string;
  phone: string;
  address: string;
  paymentId: string;
};

const RegistrationDetails = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]); // Apply the type here
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/registrations');
      if (!response.ok) throw new Error('Failed to fetch registrations');
      const data = await response.json();
      setRegistrations(data);
    } catch (err) {
      setError('Failed to load registrations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRegistrations = registrations.filter((reg) =>
    reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.phone.includes(searchTerm) ||
    reg.registrationCode.includes(searchTerm)
  );

  const exportToCSV = () => {
    const headers = ['Registration Code', 'Name', 'Phone', 'Address', 'Payment ID'];
    const csvData = filteredRegistrations.map(reg => 
      [reg.registrationCode, reg.name, reg.phone, reg.address, reg.paymentId].join(',')
    );
    
    const csv = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registrations.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Mobile card view component
  const RegistrationCard = ({ registration }: { registration: Registration }) => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm font-medium">
          {registration.registrationCode}
        </span>
        <span className="text-xs text-slate-500">
          {new Date().toLocaleDateString()} {/* Replace with actual registration date if available */}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-700">{registration.name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-slate-400" />
          <a href={`tel:${registration.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
            {registration.phone}
          </a>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-700">{registration.address}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-700">{registration.paymentId}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <p className="text-center text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">
              Registration Details
            </h2>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search registrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              <button
                onClick={exportToCSV}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Desktop view - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Address</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Payment ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRegistrations.map((reg) => (
                    <tr 
                      key={reg.registrationCode}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{reg.registrationCode}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{reg.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{reg.phone}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{reg.address}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{reg.paymentId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view - Cards */}
            <div className="md:hidden">
              {filteredRegistrations.map((reg) => (
                <RegistrationCard key={reg.registrationCode} registration={reg} />
              ))}
            </div>
              
            {filteredRegistrations.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No registrations found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetails;