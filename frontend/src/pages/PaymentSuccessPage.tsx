import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { motion } from "framer-motion";
import { CheckCircle, Download, Share2, Calendar, MapPin } from "lucide-react";

const PaymentSuccessPage: React.FC = () => {
  const location = useLocation();
  
  const [ticket, setTicket] = useState<any>(null);
  
  const navigate = useNavigate()
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get(`/api/tickets/latest`);
        setTicket(res.data.ticket);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTicket();
  }, []);

  const handleDownload = () => {
    // In a real implementation, this would download the ticket
    alert("Ticket download functionality would be implement soon");
  };

  const handleShare = () => {
    // In a real implementation, this would share the ticket
    navigate('/user/profile');
  };

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="text-white text-xl">Loading your ticket...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Animated Success Checkmark */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping"></div>
            <CheckCircle className="w-20 h-20 text-white" fill="currentColor" />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-indigo-100">Your ticket is ready. Enjoy the event!</p>
        </motion.div>

        {/* Ticket Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6"
        >
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white">
            <h2 className="text-xl font-bold mb-1">{ticket.eventTitle}</h2>
            <div className="flex items-center text-sm mb-1">
              <Calendar className="w-4 h-4 mr-1" />
              <span>June 15, 2023 at 7:00 PM</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span>Grand Concert Hall, New York</span>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-5">
            <div className="flex justify-between items-center mb-5">
              <div>
                <p className="text-gray-500 text-sm">Ticket ID</p>
                <p className="font-mono font-bold">{ticket.ticketId}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Seat</p>
                <p className="font-bold">B-12</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-5">
              <div className="p-3 bg-gray-50 rounded-lg">
                <img 
                  src={ticket.qrCode} 
                  alt="Ticket QR Code" 
                  className="w-40 h-40 mx-auto" 
                />
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 mb-1">
              Scan this code at the entrance
            </div>
          </div>

          {/* Ticket Footer */}
          <div className="border-t border-dashed border-gray-200 relative">
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"></div>
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"></div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex space-x-4"
        >
          <button 
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center bg-white text-indigo-600 py-3 rounded-lg font-medium shadow-md hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Download
          </button>
          <button 
            onClick={handleShare}
            className="flex-1 flex items-center justify-center bg-indigo-700 text-white py-3 rounded-lg font-medium shadow-md hover:bg-indigo-800 transition-colors"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Ticket Detail
          </button>
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-indigo-100 text-sm mt-6"
        >
          <p>Your ticket has been emailed to you. Present this QR code at the venue.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;