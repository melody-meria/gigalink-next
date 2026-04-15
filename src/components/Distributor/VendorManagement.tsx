"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Search, User, Edit, Power, RotateCcw, X,
  MapPin, Mail, Phone, Calendar, Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DistributorLayout } from "@/components/Distributor/DistributorLayout";
import { AddVendorModal } from "@/components/Distributor/AddVendorModal";

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  assignedVouchers: number;
  activatedVouchers: number;
  status: "Active" | "Inactive";
  joinedDate: string;
}

export interface Plan {
  id: string;
  name: string;
  validity: string;
  price: number;
  available: number;
}

const mockPlans: Plan[] = [
  { id: "1", name: "Basic Plan - 01 Day",     validity: "01 Day",  price: 50,  available: 500 },
  { id: "2", name: "Standard Plan - 03 Days",  validity: "03 Days",  price: 100,  available: 350 },
  { id: "3", name: "Premium Plan - 15 Days",   validity: "15 Days",  price: 300,  available: 200 },
  { id: "4", name: "Giga Plan - 30 Days", validity: "30 Days", price: 550, available: 150 },
];

const initialVendors: Vendor[] = [
  { id: "1", name: "Juan Dela Cruz", email: "juan@vendor1.com",  phone: "+63 917 123 4567", location: "Bongao, Tawi Tawi",      assignedVouchers: 1500, activatedVouchers: 1350, status: "Active",   joinedDate: "2025-01-15" },
  { id: "2", name: "Maria Santos",   email: "maria@vendor2.com", phone: "+63 918 234 5678", location: "Languyan, Tawi Tawi", assignedVouchers: 1200, activatedVouchers: 1050, status: "Active",   joinedDate: "2025-02-10" },
  { id: "3", name: "Pedro Reyes",    email: "pedro@vendor3.com", phone: "+63 919 345 6789", location: "Sibutu, Tawi Tawi",           assignedVouchers: 800,  activatedVouchers: 600,  status: "Inactive", joinedDate: "2024-12-20" },
  { id: "4", name: "Ana Garcia",     email: "ana@vendor4.com",   phone: "+63 920 456 7890", location: "Tandubas, Tawi Tawi", assignedVouchers: 950,  activatedVouchers: 850,  status: "Active",   joinedDate: "2025-03-01" },
];

export function VendorManagement() {
  const [vendors, setVendors]             = useState<Vendor[]>(initialVendors);
  const [searchTerm, setSearchTerm]       = useState("");
  const [statusFilter, setStatusFilter]   = useState<"All" | "Active" | "Inactive">("All");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showAddModal, setShowAddModal]   = useState(false);

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (vendor: Vendor) => {
    setVendors((prev) => prev.map((v) => v.id === vendor.id ? { ...v, status: v.status === "Active" ? "Inactive" : "Active" } : v));
    setSelectedVendor(null);
  };

  const handleAddVendor = (data: { name: string; email: string; phone: string; location: string }, assignments: Record<string, number>) => {
    const total = Object.values(assignments).reduce((s, q) => s + q, 0);
    const newVendor: Vendor = {
      id: String(vendors.length + 1),
      name: data.name, email: data.email, phone: data.phone, location: data.location,
      assignedVouchers: total, activatedVouchers: 0,
      status: "Active",
      joinedDate: new Date().toISOString().split("T")[0],
    };
    setVendors((prev) => [...prev, newVendor]);
    setShowAddModal(false);
  };

  return (
    <DistributorLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Vendor Management</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your sellers and their access</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 transition-colors w-fit">
            <Plus size={20} /> Add Vendor
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Vendors",  value: vendors.length,                                                       color: "text-slate-900 dark:text-white"     },
            { label: "Active",         value: vendors.filter((v) => v.status === "Active").length,                  color: "text-green-600 dark:text-green-400" },
            { label: "Inactive",       value: vendors.filter((v) => v.status === "Inactive").length,                color: "text-red-600 dark:text-red-400"     },
            { label: "Total Assigned", value: vendors.reduce((s, v) => s + v.assignedVouchers, 0).toLocaleString(), color: "text-slate-900 dark:text-white"     },
          ].map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{card.label}</div>
              <div className={cn("text-3xl font-bold", card.color)}>{card.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Search vendors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              {(["All", "Active", "Inactive"] as const).map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={cn("px-4 py-2 rounded-lg font-medium transition-colors text-sm",
                    statusFilter === s ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  )}
                >{s}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  {["Vendor", "Contact", "Location", "Vouchers", "Status"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} onClick={() => setSelectedVendor(vendor)} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <User className="text-blue-600 dark:text-blue-400" size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{vendor.name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Joined {vendor.joinedDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-slate-900 dark:text-white">{vendor.email}</div>
                      <div className="text-slate-500 dark:text-slate-400">{vendor.phone}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-400" />{vendor.location}</div>
                    </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-medium text-slate-900 dark:text-white">{vendor.assignedVouchers.toLocaleString()} assigned</div>
                      <div className="text-green-600 dark:text-green-400">{vendor.activatedVouchers.toLocaleString()} activated</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn("px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                        vendor.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      )}>{vendor.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Vendor Details Modal */}
        <AnimatePresence>
          {selectedVendor && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedVendor(null)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-700"
                >
                  {/* Modal Header */}
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                          <User className="text-white" size={32} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{selectedVendor.name}</h2>
                          <div className="flex items-center gap-2">
                            <span className={cn("px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                              selectedVendor.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            )}>{selectedVendor.status}</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">• Joined {selectedVendor.joinedDate}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setSelectedVendor(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <X size={24} className="text-slate-500 dark:text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)] space-y-6">
                    {/* Contact Info */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { icon: Mail,     label: "Email Address", value: selectedVendor.email,    span: false },
                          { icon: Phone,    label: "Phone Number",  value: selectedVendor.phone,    span: false },
                          { icon: MapPin,   label: "Location",      value: selectedVendor.location, span: true  },
                          { icon: Calendar, label: "Joined Date",   value: selectedVendor.joinedDate, span: false },
                        ].map(({ icon: Icon, label, value, span }) => (
                          <div key={label} className={cn("bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4 border border-slate-200 dark:border-slate-600", span && "md:col-span-2")}>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                                <Icon className="text-blue-600 dark:text-blue-400" size={16} />
                              </div>
                              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</div>
                            </div>
                            <div className="font-semibold text-slate-900 dark:text-white pl-11">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Voucher Stats */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Voucher Statistics</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2 mb-3">
                            <Package className="text-blue-600 dark:text-blue-400" size={20} />
                            <div className="text-xs text-blue-700 dark:text-blue-300 font-semibold uppercase tracking-wider">Assigned</div>
                          </div>
                          <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{selectedVendor.assignedVouchers.toLocaleString()}</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 rounded-xl p-5 border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-3">
                            <Package className="text-green-600 dark:text-green-400" size={20} />
                            <div className="text-xs text-green-700 dark:text-green-300 font-semibold uppercase tracking-wider">Activated</div>
                          </div>
                          <div className="text-3xl font-bold text-green-900 dark:text-green-100">{selectedVendor.activatedVouchers.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Activation Rate</span>
                          <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                            {((selectedVendor.activatedVouchers / selectedVendor.assignedVouchers) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                          <div
                            className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                            style={{ width: `${((selectedVendor.activatedVouchers / selectedVendor.assignedVouchers) * 100).toFixed(1)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Actions */}
                  <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button onClick={() => setSelectedVendor(null)} className="flex-1 px-5 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/30">
                        <Edit size={20} /> Edit Vendor
                      </button>
                      <button onClick={() => setSelectedVendor(null)} className="flex-1 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/30">
                        <RotateCcw size={20} /> Reset Password
                      </button>
                      <button
                        onClick={() => handleToggleStatus(selectedVendor)}
                        className={cn("flex-1 px-5 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg",
                          selectedVendor.status === "Active"
                            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/30"
                            : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-500/30"
                        )}
                      >
                        <Power size={20} />
                        {selectedVendor.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Add Vendor Modal */}
        <AddVendorModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          plans={mockPlans}
          onSubmit={handleAddVendor}
        />
      </div>
    </DistributorLayout>
  );
}
