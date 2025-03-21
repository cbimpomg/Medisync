import React from 'react';
import { MedicationManagement } from '@/components/pharmacy/MedicationManagement';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function PharmacyAdmin() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Pharmacy Management</h1>
          <p className="text-gray-600">Manage medications, inventory, and orders</p>
        </div>
        
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-md">
            <MedicationManagement />
          </div>
        </div>
      </div>
    </div>
  );
}