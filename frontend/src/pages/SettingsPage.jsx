import React, { useState } from "react";
import api from "../api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("school");
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "school", label: "School Info" },
    { id: "academic", label: "Academic Year" },
    { id: "email", label: "Email Config" },
    { id: "sms", label: "SMS Config" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-600">Manage system settings</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="border-b border-slate-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-600 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "school" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">School Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">School Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    placeholder="Enter school name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Address</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    placeholder="Enter address"
                  />
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md">
                Save Changes
              </button>
            </div>
          )}

          {activeTab === "academic" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Academic Year</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md">
                Save Changes
              </button>
            </div>
          )}

          {activeTab === "email" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">SMTP Email Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">SMTP Host</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    placeholder="smtp.example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Port</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Username</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md">
                Save Changes
              </button>
            </div>
          )}

          {activeTab === "sms" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">SMS Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">SMS Provider</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm">
                    <option>Select Provider</option>
                    <option>Twilio</option>
                    <option>MessageBird</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">API Key</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    placeholder="Enter API key"
                  />
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md">
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

