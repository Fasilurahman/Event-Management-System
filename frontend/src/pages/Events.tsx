import React, { useEffect, useState } from "react";
import {
  Plus,
  RefreshCw,
  Edit3,
  Trash2,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Search,
  Filter,
  MoreVertical,
  Users,
  TrendingUp,
  Eye,
  Ticket
} from "lucide-react";
import AdminLayout from "../component/design/AdminLayout";
import EventModal from "../component/event/EventModal";
import { deleteEventService, getAllEvents,  } from "../service/EventService"; 
import {  verifyTicketService  } from "../service/TicketService"; 
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

interface TicketVerification {
  ticketId: string;
  eventId: string;
  userId: string;
  status: string;
  purchaseDate: string;
  qrCode?: string;
}

const Events: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<TicketVerification | null>(null);
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "upcoming":
        return "text-blue-600 bg-blue-100/90 border-blue-200";
      case "ongoing":
        return "text-orange-600 bg-orange-100/90 border-orange-200";
      case "completed":
        return "text-emerald-600 bg-emerald-100/90 border-emerald-200";
      case "cancelled":
        return "text-red-600 bg-red-100/90 border-red-200";
      default:
        return "text-gray-600 bg-gray-100/90 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <CalendarIcon className="h-4 w-4" />;
      case "ongoing":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <TrendingUp className="h-4 w-4" />;
      case "cancelled":
        return <Trash2 className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getAllEvents();
        setEvents(data.events);
      } catch (error) {
        toast.error("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);



  const deleteEvent = async (eventId: string) => {
    const toastId = toast.warning("Event deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          toast.dismiss(toastId);
        },
      },
      duration: 5000,
    });

    setTimeout(async () => {
      try {
        await deleteEventService(eventId);
        setEvents(events.filter((event) => event.id !== eventId));
        toast.success("Event deleted successfully");
      } catch (error: any) {
        toast.error("Failed to delete event");
      }
    }, 8100);
  };

  const handleSave = (event: Event) => {
    if (selectedEvent) {
      setEvents((prev) => prev.map((ev) => (ev.id === event.id ? event : ev)));
      toast.success("Event updated successfully");
    } else {
      setEvents((prev) => [...prev, event]);
      toast.success("Event created successfully");
    }
    setSelectedEvent(null);
    setShowEventModal(false);
  };

  // Inside your component
const handleVerifyTicket = async () => {
  if (!ticketId.trim()) {
    toast.error("Please enter a ticket ID");
    return;
  }
  try {
    setVerifyLoading(true);
    const result = await verifyTicketService(ticketId);
    console.log(result,'result')
    // setVerificationResult(result.ticket); // backend should return { ticket }
    toast.success("Ticket verified successfully");
  } catch (error: any) {
    setVerificationResult(null);
    toast.error("Failed to verify ticket: Invalid or expired ticket ID");
  } finally {
    setVerifyLoading(false);
  }
};


  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white/90 backdrop-blur-2xl border border-gray-100/50 rounded-2xl p-6 shadow-lg animate-pulse"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="h-6 w-20 bg-gray-200/50 rounded-full"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-200/50 rounded-full"></div>
              <div className="h-8 w-8 bg-gray-200/50 rounded-full"></div>
            </div>
          </div>
          <div className="h-7 w-3/4 bg-gray-200/50 rounded mb-3"></div>
          <div className="h-4 w-full bg-gray-200/50 rounded mb-4"></div>
          <div className="space-y-3 mb-5">
            <div className="h-4 w-2/3 bg-gray-200/50 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200/50 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200/50 rounded"></div>
          </div>
          <div className="flex justify-between mb-4">
            <div className="h-4 w-1/3 bg-gray-200/50 rounded"></div>
            <div className="h-6 w-1/4 bg-gray-200/50 rounded"></div>
          </div>
          <div className="h-3 w-full bg-gray-200/50 rounded-full"></div>
        </div>
      ))}
    </div>
  );

  return (
    <AdminLayout title="Event Management" description="Create and manage your events with ease">
      <div className="space-y-8">
        {/* Verify Ticket Section */}
        <div className="bg-white/95 backdrop-blur-xl border border-gray-100/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Verify Ticket</h3>
            <Ticket className="h-6 w-6 text-teal-600" />
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Enter a ticket ID to verify its validity. QR code verification will be supported in the future.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              type="text"
              placeholder="Enter Ticket ID"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              className="w-full sm:w-80 pl-4 pr-4 py-2.5 bg-white/90 border border-gray-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-sm text-gray-700 placeholder-gray-400 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
            />
            <button
              onClick={handleVerifyTicket}
              disabled={verifyLoading}
              className={`flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden ${verifyLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-white/20"></div>
              <Ticket className="h-5 w-5 relative z-10" />
              <span className="text-sm font-semibold relative z-10">Verify Ticket</span>
            </button>
          </div>
          {verificationResult && (
            <div className="mt-4 p-4 bg-gray-50/90 rounded-xl border border-gray-100/50">
              <h4 className="text-lg font-semibold text-gray-900">Verification Result</h4>
              <div className="mt-2 space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Ticket ID:</span> {verificationResult.ticketId}</p>
                <p><span className="font-medium">Event ID:</span> {verificationResult.eventId}</p>
                <p><span className="font-medium">User ID:</span> {verificationResult.userId}</p>
                <p><span className="font-medium">Status:</span> {verificationResult.status.charAt(0).toUpperCase() + verificationResult.status.slice(1)}</p>
                <p><span className="font-medium">Purchase Date:</span> {new Date(verificationResult.purchaseDate).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-teal-500 transition-colors duration-200" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-gray-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-sm text-gray-700 placeholder-gray-400 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
            />
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-white/90 border border-gray-100/50 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="px-4 py-2.5 bg-white/90 border border-gray-100/50 rounded-xl text-sm text-gray-700 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              {viewMode === "grid" ? "List View" : "Grid View"}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white/90 border border-gray-100/50 rounded-xl shadow-sm hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <RefreshCw className="h-5 w-5 text-gray-600 group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-sm font-semibold">Refresh</span>
            </button>
            <button
              onClick={() => {
                setSelectedEvent(null);
                setShowEventModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-white/20"></div>
              <Plus className="h-5 w-5 relative z-10" />
              <span className="text-sm font-semibold relative z-10">Create Event</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Events", value: events.length, icon: CalendarIcon, color: "bg-blue-100/90 text-blue-600" },
            { label: "Upcoming", value: events.filter(e => e.status === "upcoming").length, icon: Clock, color: "bg-orange-100/90 text-orange-600" },
            { label: "Attendees", value: events.reduce((acc, event) => acc + event.attendees, 0), icon: Users, color: "bg-emerald-100/90 text-emerald-600" },
            { label: "Revenue", value: `$${events.reduce((acc, event) => acc + (event.price * event.attendees), 0).toLocaleString()}`, icon: TrendingUp, color: "bg-purple-100/90 text-purple-600" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/95 backdrop-blur-xl border border-gray-100/50 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Events Grid/List */}
        {loading ? (
          <SkeletonLoader />
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white/95 backdrop-blur-xl border border-gray-100/50 rounded-2xl shadow-lg transform transition-all duration-300">
            <CalendarIcon className="h-20 w-20 text-gray-300 mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Events Found</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria to find events."
                : "Get started by creating your first event!"}
            </p>
            <button
              onClick={() => {
                setSelectedEvent(null);
                setShowEventModal(true);
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-white/20"></div>
              <Plus className="h-5 w-5 relative z-10" />
              <span className="text-sm font-semibold relative z-10">Create Event</span>
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="relative bg-white/95 backdrop-blur-2xl border border-gray-100/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {getStatusIcon(event.status)}
                    <span className="ml-1.5">{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span>
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowEventModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-100/90 rounded-full transition-all duration-200 transform hover:scale-110"
                      title="Edit event"
                    >
                      <Edit3 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="p-2 text-red-600 hover:bg-red-100/90 rounded-full transition-all duration-200 transform hover:scale-110"
                      title="Delete event"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:bg-gray-100/90 rounded-full transition-all duration-200 transform hover:scale-110">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-xl font-bold text-gray-900 mb-3 tracking-tight relative z-10 line-clamp-1">
                  {event.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 relative z-10 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-4 mb-5 relative z-10">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CalendarIcon className="h-5 w-5 text-teal-500 flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-5 w-5 text-teal-500 flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-5 w-5 text-teal-500 flex-shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="text-sm font-medium">
                    <span className="font-bold text-gray-900">{event.attendees}</span>
                    <span className="text-gray-500">/{event.maxAttendees} attendees</span>
                  </div>
                  <div className="text-lg font-bold text-teal-600">${event.price}</div>
                </div>

                <div className="bg-gray-100 rounded-full h-3 overflow-hidden relative z-10">
                  <div
                    className="bg-gradient-to-r from-teal-600 to-cyan-400 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${(event.attendees / event.maxAttendees) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-2xl border border-gray-100/50 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100/50 bg-gray-50/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Attendees</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50/90 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-teal-100/90 rounded-lg flex items-center justify-center text-teal-600">
                            <CalendarIcon className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">{event.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{event.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{event.date}</div>
                        <div className="text-sm text-gray-500">{event.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{event.attendees}/{event.maxAttendees}</div>
                        <div className="w-full bg-gray-100/90 rounded-full h-2 mt-1">
                          <div 
                            className="bg-gradient-to-r from-teal-600 to-cyan-400 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(event.status)}`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-teal-600 hover:text-teal-800 transform hover:scale-110 transition-all duration-200">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowEventModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transform hover:scale-110 transition-all duration-200"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => deleteEvent(event.id)}
                            className="text-red-600 hover:text-red-800 transform hover:scale-110 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <EventModal
          showEventModal={showEventModal}
          selectedEvent={selectedEvent}
          setShowEventModal={setShowEventModal}
          setSelectedEvent={setSelectedEvent}
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  );
};

export default Events;