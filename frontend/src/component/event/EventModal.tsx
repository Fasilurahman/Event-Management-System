import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  createEventService,
  updateEventService,
} from "../../service/EventService";
import { eventSchema } from "../../schema/eventSchema";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  maxAttendees: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  price: number;
  judges: string[];
  food: string;
  guests: string[];
}

interface EventModalProps {
  showEventModal: boolean;
  selectedEvent: Event | null;
  setShowEventModal: (show: boolean) => void;
  setSelectedEvent: (event: Event | null) => void;
  onSave: (eventData: Event) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  showEventModal,
  selectedEvent,
  setShowEventModal,
  setSelectedEvent,
  onSave,
}) => {
  if (!showEventModal) return null;

  const [formData, setFormData] = useState<Event>({
    id: selectedEvent?.id || "",
    title: selectedEvent?.title || "",
    description: selectedEvent?.description || "",
    date: selectedEvent?.date || "",
    time: selectedEvent?.time || "",
    location: selectedEvent?.location || "",
    category: selectedEvent?.category || "",
    attendees: selectedEvent?.attendees || 0,
    maxAttendees: selectedEvent?.maxAttendees || 0,
    status: selectedEvent?.status || "upcoming",
    price: selectedEvent?.price || 0,
    judges: selectedEvent?.judges || [],
    food: selectedEvent?.food || "",
    guests: selectedEvent?.guests || [],
  });

  useEffect(() => {
    setFormData({
      id: selectedEvent?.id || "",
      title: selectedEvent?.title || "",
      description: selectedEvent?.description || "",
      date: selectedEvent?.date || "",
      time: selectedEvent?.time || "",
      location: selectedEvent?.location || "",
      category: selectedEvent?.category || "",
      attendees: selectedEvent?.attendees || 0,
      maxAttendees: selectedEvent?.maxAttendees || 0,
      status: selectedEvent?.status || "upcoming",
      price: selectedEvent?.price || 0,
      judges: selectedEvent?.judges || [],
      food: selectedEvent?.food || "",
      guests: selectedEvent?.guests || [],
    });
  }, [selectedEvent]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "judges" | "guests"
  ) => {
    const value = e.target.value.split(",").map((item) => item.trim());
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = eventSchema.safeParse({
        ...formData,
        price: Number(formData.price),
        maxAttendees: Number(formData.maxAttendees),
      });
      if (!parsed.success) {
        const firstError = parsed.error.issues[0];
        toast.error(firstError.message, { duration: 4000 });
        return;
      }
      let savedEvent: Event;
      const eventToSend = { ...parsed.data, id: selectedEvent ? selectedEvent.id : "" };
      if (selectedEvent) {
        savedEvent = await updateEventService(selectedEvent.id, eventToSend);
      } else {
        savedEvent = await createEventService(eventToSend);
      }

      onSave(savedEvent);
      handleClose();
    } catch (error: any) {
      console.error("Error saving event:", error);
      toast.error(error.message || "Failed to save event", { duration: 4000 });
    }
  };

  const handleClose = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "upcoming":
        return "text-blue-700 bg-blue-100/95 border-blue-200/50";
      case "ongoing":
        return "text-orange-700 bg-orange-100/95 border-orange-200/50";
      case "completed":
        return "text-emerald-700 bg-emerald-100/95 border-emerald-200/50";
      case "cancelled":
        return "text-red-700 bg-red-100/95 border-red-200/50";
      default:
        return "text-gray-700 bg-gray-100/95 border-gray-200/50";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-500">
      <div className="bg-white/95 backdrop-blur-2xl border border-gray-100/50 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform scale-95 animate-in zoom-in-90 duration-300">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
            {selectedEvent ? "Edit Event" : "Create New Event"}
          </h3>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100/95 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-800">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-300"
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <option value="">Select category</option>
                  <option value="Technology">Technology</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Business">Business</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-white/80 border border-gray-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-300"
                placeholder="Describe your event"
              />
            </div>
          </section>

          <section className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-800">Event Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-300"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-300"
                  placeholder="Enter event location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Attendees
                </label>
                <input
                  type="number"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-300"
                  placeholder="100"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/80 border border-gray-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-800 shadow-sm hover:shadow-md transition-all duration-300 ${getStatusColor(formData.status)}`}
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </section>

          <section className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-800">Additional Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judges (comma-separated)
                </label>
                <input
                  type="text"
                  name="judges"
                  value={formData.judges.join(", ")}
                  onChange={(e) => handleArrayChange(e, "judges")}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-300"
                  placeholder="e.g., John Doe, Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guests (comma-separated)
                </label>
                <input
                  type="text"
                  name="guests"
                  value={formData.guests.join(", ")}
                  onChange={(e) => handleArrayChange(e, "guests")}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-300"
                  placeholder="e.g., Alice Johnson, Bob Wilson"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Arrangements
              </label>
              <textarea
                name="food"
                value={formData.food}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-white/80 border border-gray-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-300"
                placeholder="e.g., Buffet with vegetarian and non-vegetarian options"
              />
            </div>
          </section>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100/50">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-white/80 border border-gray-200/50 text-gray-700 rounded-xl shadow-sm hover:bg-gray-100/95 hover:shadow-md transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              <span className="relative z-10 font-medium">
                {selectedEvent ? "Update Event" : "Create Event"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;