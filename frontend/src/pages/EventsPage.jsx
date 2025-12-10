import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import Table from "../components/Table";
import Modal from "../components/Modal";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import { useToast } from "../components/ToastProvider";

export default function EventsPage() {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    eventTime: "",
    location: "",
    targetAudience: "ALL",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/events").catch(() => ({ data: { data: [] } }));
      setEvents(res.data?.data || []);
    } catch (err) {
      showToast("Failed to fetch events", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", formData);
      showToast("Event created successfully", "success");
      setShowAddModal(false);
      setFormData({
        title: "",
        description: "",
        eventDate: "",
        eventTime: "",
        location: "",
        targetAudience: "ALL",
      });
      fetchEvents();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create event", "error");
    }
  };

  const columns = [
    { header: "Title", accessor: "title" },
    {
      header: "Date",
      accessor: "eventDate",
      render: (row) => (row.eventDate ? new Date(row.eventDate).toLocaleDateString() : "-"),
    },
    {
      header: "Time",
      accessor: "eventTime",
      render: (row) => row.eventTime || "-",
    },
    { header: "Location", accessor: "location", render: (row) => row.location || "-" },
    {
      header: "Target Audience",
      accessor: "targetAudience",
      render: (row) => (
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
          {row.targetAudience || "ALL"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Events</h2>
          <p className="text-sm text-slate-600 mt-1">View and manage school events</p>
        </div>
        {isAdmin && <Button onClick={() => setShowAddModal(true)}>Create Event</Button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div key={event.eventId} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{event.title}</h3>
            <p className="text-sm text-slate-600 mb-4">{event.description}</p>
            <div className="space-y-1 text-xs text-slate-500">
              <p>📅 {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "-"}</p>
              {event.eventTime && <p>🕐 {event.eventTime}</p>}
              {event.location && <p>📍 {event.location}</p>}
            </div>
          </div>
        ))}
      </div>

      {isAdmin && (
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setFormData({
              title: "",
              description: "",
              eventDate: "",
              eventTime: "",
              location: "",
              targetAudience: "ALL",
            });
          }}
          title="Create New Event"
          size="lg"
        >
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <FormInput
              label="Event Title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Event Date"
                name="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                required
              />
              <FormInput
                label="Event Time"
                name="eventTime"
                type="time"
                value={formData.eventTime}
                onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
              />
            </div>
            <FormInput
              label="Location"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              >
                <option value="ALL">All</option>
                <option value="STUDENTS">Students</option>
                <option value="TEACHERS">Teachers</option>
                <option value="PARENTS">Parents</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    title: "",
                    description: "",
                    eventDate: "",
                    eventTime: "",
                    location: "",
                    targetAudience: "ALL",
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Create Event</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

