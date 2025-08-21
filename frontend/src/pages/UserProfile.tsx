import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchTicketsService,
  fetchUserService,
} from "../service/TicketService";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { clearUser } from "../redux/authSlice";

// Define interfaces
interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  maxAttendees: number;
  price: number;
  available?: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  judges: string[];
  food: string;
  guests: string[];
  createdAt: string;
  updatedAt: string;
}

interface Ticket {
  _id: string;
  ticketId: string;
  eventId: Event;
  userId: string;
  status: "booked" | "confirmed" | "cancelled";
  purchaseDate: string;
  qrCode: string;
}

interface TicketResponse {
  tickets: Ticket[];
}

const UserProfile = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 2;

  // Filter tickets by status
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filteredTickets =
    filterStatus === "all"
      ? tickets
      : tickets.filter((ticket) => ticket.status === filterStatus);

  // Get current tickets for pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "booked":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Function to get category color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "technology":
        return "bg-blue-100 text-blue-800";
      case "music":
        return "bg-purple-100 text-purple-800";
      case "art":
        return "bg-pink-100 text-pink-800";
      case "business":
        return "bg-indigo-100 text-indigo-800";
      case "food & drink":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Open modal with selected QR code
  const openModal = (qrCode: string) => {
    setSelectedQrCode(qrCode);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedQrCode(null);
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data: TicketResponse = await fetchTicketsService();

      if (data && Array.isArray(data.tickets)) {
        setTickets(data.tickets);
      } else {
        console.error("Unexpected data format:", data);
        setTickets([]);
        toast.error("Unexpected data format received from server");
      }
    } catch (error: any) {
      console.error("Error fetching tickets:", error, error.response?.data);
      setTickets([]);
      toast.error(error.response?.data?.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);
  const userId = useSelector((state: RootState) => state.user.user?._id);

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchUserService(userId!);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>

        {/* User Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <path
                fill="currentColor"
                d="M45.2,-58.9C64.5,-47.9,88.5,-38.9,96.4,-21.2C104.3,-3.5,96.1,22.9,80.4,41.6C64.7,60.3,41.5,71.4,17.9,77.1C-5.7,82.8,-29.7,83.2,-45.9,70.8C-62.1,58.4,-70.5,33.2,-73.3,7.4C-76.1,-18.4,-73.3,-44.8,-60.1,-57.7C-46.9,-70.6,-23.4,-70.1,-1.8,-68.1C19.8,-66.1,39.6,-62.7,45.2,-58.9Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>

          <div className="flex flex-col md:flex-row items-center relative z-10">
            <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold mb-4 md:mb-0 shadow-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="md:ml-8 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
              <p className="text-indigo-100 mb-4">{user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                  {tickets.length} {tickets.length === 1 ? "Ticket" : "Tickets"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for QR Code */}
        {modalOpen && selectedQrCode && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label="QR Code Modal"
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Scan QR Code
                </h3>
                <img
                  src={selectedQrCode}
                  alt="Enlarged QR Code"
                  className="w-64 h-64 rounded-lg border-2 border-gray-200 shadow-md"
                />
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Scan this QR code to access your ticket.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with filters and stats */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filter Tickets
              </h3>
              <div className="space-y-2">
                {["all", "booked", "confirmed", "cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      filterStatus === status
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          filterStatus === status
                            ? "bg-white/20"
                            : "bg-gray-200"
                        }`}
                      >
                        {status === "all"
                          ? tickets.length
                          : tickets.filter((t) => t.status === status).length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Account Actions
              </h3>
              <button
                onClick={() => handleLogout()}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Tickets Section */}
            <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center mb-3 sm:mb-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  Purchased Tickets
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({filteredTickets.length} items)
                  </span>
                </h2>

                {/* Pagination Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      paginate(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <svg
                    className="animate-spin h-8 w-8 text-indigo-600 mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <p className="text-gray-600 mt-2">Loading tickets...</p>
                </div>
              ) : currentTickets.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-600 mt-2">
                    No tickets found with the selected filter.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {currentTickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50/50"
                    >
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {ticket.eventId?.title || "Event Not Found"}
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">
                                {ticket.eventId
                                  ? `${formatDate(ticket.eventId.date)} • ${
                                      ticket.eventId.time
                                    }`
                                  : "Date information not available"}
                              </p>
                            </div>
                            <div className="flex items-center mt-2 sm:mt-0">
                              {ticket.eventId && (
                                <span
                                  className={`inline-block px-2 py-1 rounded-md text-xs font-medium mr-2 ${getCategoryColor(
                                    ticket.eventId.category
                                  )}`}
                                >
                                  {ticket.eventId.category}
                                </span>
                              )}
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  ticket.status
                                )}`}
                              >
                                {ticket.status.charAt(0).toUpperCase() +
                                  ticket.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-700">
                              <span className="font-medium">Purchased:</span>{" "}
                              {formatDate(ticket.purchaseDate)}
                            </div>
                            {ticket.eventId && (
                              <>
                                <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-700">
                                  <span className="font-medium">Price:</span> $
                                  {ticket.eventId.price}
                                </div>
                                <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-700">
                                  <span className="font-medium">Location:</span>{" "}
                                  {ticket.eventId.location}
                                </div>
                              </>
                            )}
                          </div>

                          {ticket.eventId && (
                            <p className="text-gray-700 text-sm line-clamp-2">
                              Ticket ID: {ticket?.ticketId}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0 flex justify-center">
                          <div className="relative">
                            <button
                              onClick={() => openModal(ticket.qrCode)}
                              className="focus:outline-none"
                              aria-label="Enlarge QR Code"
                            >
                              <img
                                src={ticket.qrCode}
                                alt="QR Code"
                                className="w-20 h-20 rounded border-2 border-gray-200 shadow-sm hover:opacity-80 transition-opacity duration-200"
                              />
                              <div className="absolute inset-0 border-2 border-white rounded opacity-20"></div>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="flex flex-wrap gap-2 mb-3 sm:mb-0">
                          {ticket.eventId?.food && (
                            <span className="inline-flex items-center text-xs bg-amber-100 text-amber-800 px-2.5 py-1.5 rounded-full">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 013 15.546V5a1 1 0 011-1h16a1 1 0 011 1v10.546z"
                                />
                              </svg>
                              Food Included
                            </span>
                          )}

                          {ticket.eventId?.guests.length > 0 && (
                            <span className="inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2.5 py-1.5 rounded-full">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              {ticket.eventId.guests.length} Special Guest
                              {ticket.eventId.guests.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => navigate(`/ticket/${ticket._id}`)}
                          className="text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                        >
                          View Details
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Page Navigation */}
            <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-md">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>

              <div className="hidden md:flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                        currentPage === number
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
