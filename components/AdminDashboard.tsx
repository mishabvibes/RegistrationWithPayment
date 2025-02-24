import React, { useState, useEffect } from "react";
import { Loader2, Search, Download, Edit, Trash2, Plus, Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "../app/context/AuthContext";

// Define the Registration type
type Registration = {
  registrationCode: string;
  name: string;
  phone: string;
  address: string;
  paymentId: string;
};

// Custom DropdownMenu Component
const DropdownMenu = ({ children, trigger }: { children: React.ReactNode; trigger: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          onClick={() => setIsOpen(false)}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};

const DropdownMenuItem = ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <div
    onClick={onClick}
    className={`${className} block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer`}
  >
    {children}
  </div>
);

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [formData, setFormData] = useState<Partial<Registration>>({
    name: "",
    phone: "",
    address: "",
    paymentId: "",
    registrationCode: "",
  });
  const { logout } = useAuth();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/registrations");
      if (!response.ok) throw new Error("Failed to fetch registrations");
      const data = await response.json();
      setRegistrations(data);
    } catch (err) {
      // setError("Failed to load registrations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedRegistration(null);
    setFormData({
      name: "",
      phone: "",
      address: "",
      paymentId: "",
      registrationCode: "MN" + Math.floor(Math.random() * 9000 + 1000),
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (registration: Registration) => {
    setSelectedRegistration(registration);
    setFormData(registration);
    setIsDialogOpen(true);
  };

  const handleDelete = async (registrationCode: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;

    try {
      const response = await fetch(`/api/registrations/${registrationCode}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete registration");

      setRegistrations((prev) =>
        prev.filter((reg) => reg.registrationCode !== registrationCode)
      );
    } catch (err) {
      console.error("Error deleting registration:", err);
      alert("Failed to delete registration");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = selectedRegistration
        ? `/api/registrations/${selectedRegistration.registrationCode}`
        : "/api/registrations";

      const method = selectedRegistration ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save registration");

      await fetchRegistrations();
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error saving registration:", err);
      alert("Failed to save registration");
    }
  };

  const filteredRegistrations = registrations.filter(
    (reg) =>
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

  const MobileRegistrationCard = ({ reg }: { reg: Registration }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-slate-800">{reg.name}</h3>
          <p className="text-sm text-slate-500">{reg.registrationCode}</p>
        </div>
        <DropdownMenu
          trigger={
            <Button variant="ghost" size="sm" className="hover:bg-gray-100">
              <Menu className="h-4 w-4" />
            </Button>
          }
        >
          <DropdownMenuItem onClick={() => handleEdit(reg)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDelete(reg.registrationCode)}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
      <div className="space-y-1 text-sm">
        <p className="flex items-center text-slate-600">
          <span className="w-20 text-slate-400">Phone:</span>
          {reg.phone}
        </p>
        <p className="flex items-center text-slate-600">
          <span className="w-20 text-slate-400">Address:</span>
          {reg.address}
        </p>
        <p className="flex items-center text-slate-600">
          <span className="w-20 text-slate-400">Payment:</span>
          {reg.paymentId}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button
                onClick={handleCreate}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4" />
                Add New
              </Button>
              <Button
                onClick={exportToCSV}
                variant="outline"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 border-slate-300 hover:bg-slate-100"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                onClick={logout}
                variant="destructive"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
              >
                Logout
              </Button>
            </div>
          </div>

          <div className="py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, phone, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile View */}
        <div className="sm:hidden">
          {filteredRegistrations.map((reg) => (
            <MobileRegistrationCard key={reg.registrationCode} reg={reg} />
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block overflow-x-auto">
          <div className="bg-white rounded-lg shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Payment ID</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.registrationCode} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{reg.registrationCode}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{reg.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{reg.phone}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{reg.address}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{reg.paymentId}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleEdit(reg)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(reg.registrationCode)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedRegistration ? "Edit Registration" : "Add Registration"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Registration Code
              </label>
              <input
                type="text"
                value={formData.registrationCode}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payment ID</label>
              <input
                type="text"
                value={formData.paymentId}
                onChange={(e) => setFormData({ ...formData, paymentId: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                {selectedRegistration ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;