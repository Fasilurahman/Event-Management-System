import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  ArrowLeft,
  Star,
  ChefHat,
  Award,
  Ticket,
  Share2,
  Heart,
  ExternalLink
} from 'lucide-react';
import { createCheckoutSessionService } from '../service/EventService';

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
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  price: number;
  judges: string[];
  food: string;
  guests: string[];
}

const SingleEventPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state as Event;
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Better image selection based on category
  const getEventImage = () => {
    const category = event?.category?.toLowerCase() || 'event';
    const imageMap: Record<string, string> = {
      technology: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      marketing: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f5a07a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      business: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    };
    
    return imageMap[category] || imageMap.default;
  };

  const eventImageUrl = getEventImage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 300);
    
    if (event && event.status === 'upcoming') {
      const eventDate = new Date(`${event.date}T${event.time}`);
      const updateCountdown = () => {
        const now = new Date();
        const diff = eventDate.getTime() - now.getTime();
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          setCountdown({ days, hours, minutes, seconds });
        }
      };
      
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
    
    return () => clearTimeout(timer);
  }, [event]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-100">
        <div className="text-center py-10 px-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40">
          <div className="text-4xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or may have been removed.</p>
          <button 
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

const handlePayment = async (event: Event) => {
  const stripe = await stripePromise;
  await createCheckoutSessionService(event.id, stripe);
};

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technology': return 'bg-purple-100 text-purple-800';
      case 'design': return 'bg-pink-100 text-pink-800';
      case 'marketing': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const progressPercentage = (event.attendees / event.maxAttendees) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/70 via-cyan-50/50 to-blue-50/60 pb-20">
      {/* Header with back button */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-white/40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-teal-600 hover:text-teal-700 font-medium group transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Back to Events
          </button>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleShare}
              className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors relative"
            >
              <Share2 className="h-5 w-5 text-gray-600" />
              
              {showShareOptions && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-10 animate-fade-in">
                  <div className="text-sm font-medium text-gray-700 mb-2">Share this event</div>
                  <div className="flex space-x-3">
                    <button className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <span className="text-blue-600">FB</span>
                    </button>
                    <button className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                      <span className="text-blue-400">TW</span>
                    </button>
                    <button className="p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                      <span className="text-red-500">IN</span>
                    </button>
                  </div>
                </div>
              )}
            </button>
            
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full border transition-all duration-300 ${isLiked 
                ? 'bg-pink-50 border-pink-200 text-pink-500' 
                : 'bg-white border-gray-200 text-gray-400 hover:text-pink-400'}`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="relative rounded-3xl overflow-hidden shadow-xl mb-8 h-80">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
          
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-teal-100 to-cyan-200 animate-pulse"></div>
          )}
          
          <img 
            src={eventImageUrl}
            alt={event.title}
            className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                {event.category}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold mb-2 drop-shadow-md">{event.title}</h1>
            
            <div className="flex items-center text-teal-200">
              <MapPin className="h-5 w-5 mr-1" />
              <span className="font-medium">{event.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/40 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-3 h-3 bg-teal-500 rounded-full mr-3"></span>
                Event Details
              </h2>
              
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">{event.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start space-x-4 p-4 bg-gray-50/50 rounded-xl">
                  <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Date</h3>
                    <p className="text-gray-900 font-semibold">{formatDate(event.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-gray-50/50 rounded-xl">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Time</h3>
                    <p className="text-gray-900 font-semibold">{event.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-gray-50/50 rounded-xl">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Attendees</h3>
                    <p className="text-gray-900 font-semibold">{event.attendees} / {event.maxAttendees}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-gray-50/50 rounded-xl">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <Ticket className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Price</h3>
                    <p className="text-gray-900 font-semibold">
                      {event.price > 0 ? `$${event.price}` : 'Free'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Judges section */}
              {event.judges.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-amber-500" />
                    Distinguished Judges
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {event.judges.map((judge, index) => (
                      <span key={index} className="px-4 py-2 bg-amber-50 text-amber-800 rounded-full text-sm font-medium flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-amber-400 text-amber-400" />
                        {judge}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Guests section */}
              {event.guests.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Special Guests</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.guests.map((guest, index) => (
                      <div key={index} className="flex items-center p-3 bg-violet-50 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                          {guest.charAt(0)}
                        </div>
                        <span className="text-gray-800 font-medium">{guest}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Food section */}
              {event.food && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <ChefHat className="h-5 w-5 mr-2 text-rose-500" />
                    Food & Beverages
                  </h3>
                  <p className="text-gray-600 bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                    {event.food}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar - Registration/Payment */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/40">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Join This Event</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{formatDate(event.date)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{event.time}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium text-right">{event.location}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Price</span>
                  <span className="font-medium text-teal-600">
                    {event.price > 0 ? `$${event.price}` : 'Free'}
                  </span>
                </div>
              </div>
              
              {event.status === 'upcoming' || event.status === 'ongoing' ? (
                <button
                  onClick={() => handlePayment(event)}
                  disabled={event.attendees >= event.maxAttendees}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-105 ${
                    event.attendees >= event.maxAttendees 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600'
                  }`}
                >
                  {event.attendees >= event.maxAttendees 
                    ? 'Sold Out' 
                    : event.price > 0 ? 'Register Now & Pay' : 'Register for Free'}
                </button>
              ) : (
                <div className="text-center py-4 bg-gray-100 rounded-xl text-gray-600 font-medium">
                  Registration closed for this event
                </div>
              )}
              
              {event.attendees < event.maxAttendees && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  {event.maxAttendees - event.attendees} spots remaining
                </div>
              )}
              
              <div className="mt-6 p-4 bg-cyan-50/50 rounded-xl border border-cyan-100">
                <h4 className="font-medium text-cyan-800 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                  What's included
                </h4>
                <ul className="text-sm text-cyan-700 space-y-1">
                  <li>• Access to all sessions</li>
                  <li>• Networking opportunities</li>
                  {event.food && <li>• Food and beverages</li>}
                  <li>• Event materials</li>
                  <li>• Certificate of participation</li>
                </ul>
              </div>
            </div>      
          </div>
        </div>
      </div>
      

      {/* <div className="fixed bottom-6 right-6 lg:hidden">
        <button
          onClick={handlePayment}
          disabled={event.attendees >= event.maxAttendees}
          className={`p-4 rounded-full shadow-lg text-white font-bold ${
            event.attendees >= event.maxAttendees 
              ? 'bg-gray-400' 
              : 'bg-gradient-to-r from-teal-500 to-cyan-500'
          }`}
        >
          {event.price > 0 ? `$${event.price}` : 'Register'}
        </button>
      </div> */}
    </div>
  );
};

export default SingleEventPage;