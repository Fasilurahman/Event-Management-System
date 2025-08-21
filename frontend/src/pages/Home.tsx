import { useState, useEffect } from "react";
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  Star,
  Menu,
  X,
  ChevronRight,
  Calendar,
  Ticket,
  MapPin,
  Video,
  CheckCircle,
  TrendingUp,
  MessageCircle,
  Heart,
  Share,
  Play,
} from "lucide-react";
import { getAllEvents } from "../service/EventService";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { clearUser } from "../redux/authSlice";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  icon?: any;
}

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getAllEvents();
        setEvents(res.events);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Calendar,
      title: "Intensive Training",
      description:
        "12-month program with hands-on projects and real-world applications in various tech domains.",
    },
    {
      icon: Ticket,
      title: "Expert Mentorship",
      description:
        "Guidance from industry veterans with 3+ years of experience and peer-to-peer learning.",
    },
    {
      icon: MapPin,
      title: "Multiple Locations",
      description:
        "Hubs in Kochi, Kozhikode, Trivandrum, Bengaluru, Coimbatore, and Chennai.",
    },
    {
      icon: Users,
      title: "Community Network",
      description:
        "Join 2100+ alumni placed in 1220+ companies for referrals and support.",
    },
    {
      icon: TrendingUp,
      title: "Placement Support",
      description:
        "Lifetime assistance with average salary of ₹39,000/month and 100% money-back guarantee.",
    },
    {
      icon: Shield,
      title: "No Prior Experience Needed",
      description:
        "Designed for beginners from non-IT backgrounds with flexible online/offline options.",
    },
  ];

  const testimonials = [
    {
      name: "Arun P S",
      role: "MERN Stack Developer, Georg Rugamer GmbH",
      content:
        "Brototype transformed my career. From no IT background to a high-paying job at 35 LPA. The intensive training and support were invaluable.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Anoop Sukumaran Nair",
      role: "MERN Stack Developer, Cromwell Tools",
      content:
        "Outstanding program that equipped me with industry-ready skills. Placed at 32 LPA thanks to the excellent mentorship and projects.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Jafin Jahfar",
      role: "MERN Stack Developer, Sellscript",
      content:
        "The peer-to-peer learning and real-world projects made all the difference. Highly recommend for anyone entering tech.",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    },
  ];

  const stats = [
    { value: "2100+", label: "Lives Transformed" },
    { value: "1220+", label: "Companies" },
    { value: "₹39K", label: "Avg Monthly Salary" },
    { value: "4.9/5", label: "User Rating" },
  ];

  const handleRegister = (event: Event) => {
    navigate(`/event/${event.id}`, { state: event });
  };

  const user = useSelector((state: RootState) => state?.user.user);
  const dispatch = useDispatch();

  // const events = [
  //   {
  //     icon: Calendar,
  //     title: "Web Development Workshop",
  //     date: "September 15, 2025",
  //     location: "Kochi Hub",
  //     description: "Hands-on session on MERN Stack for beginners. Limited seats available."
  //   },
  //   {
  //     icon: Video,
  //     title: "AI/ML Webinar",
  //     date: "October 5, 2025",
  //     location: "Online",
  //     description: "Explore Artificial Intelligence fundamentals with industry experts."
  //   },
  //   {
  //     icon: Users,
  //     title: "Alumni Meetup",
  //     date: "November 20, 2025",
  //     location: "Bengaluru Hub",
  //     description: "Network with successful alumni and share experiences."
  //   },
  //   {
  //     icon: CheckCircle,
  //     title: "New Batch Orientation",
  //     date: "December 1, 2025",
  //     location: "All Hubs",
  //     description: "Kickstart your Brocamp journey with motivational sessions."
  //   },
  //   {
  //     icon: TrendingUp,
  //     title: "Placement Drive",
  //     date: "January 10, 2026",
  //     location: "Online/Offline",
  //     description: "Connect with top companies for job opportunities."
  //   },
  //   {
  //     icon: Shield,
  //     title: "Cyber Security Seminar",
  //     date: "February 15, 2026",
  //     location: "Chennai Hub",
  //     description: "Learn about latest threats and protection strategies."
  //   }
  // ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-100/40 to-cyan-100/30 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-100/35 to-teal-100/25 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-teal-50/30 via-transparent to-cyan-50/30 rounded-full blur-3xl"></div>

        {/* Geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-teal-500/10 rounded-lg rotate-45"></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-cyan-500/10 rounded-lg rotate-12"></div>
        <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-teal-400/10 rounded-lg -rotate-12"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/90 border-b border-white/20 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center mr-2">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Brototype
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#events"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Events
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Testimonials
              </a>
              <button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-teal-500/20">
                Join Brocamp
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none">
                <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold shadow-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 font-medium">{user?.name}</span>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-white/40 backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-40">
                <div className="py-2">
                  <a
                    href="/user/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    Profile
                  </a>

                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      dispatch(clearUser());
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-teal-600 transition-colors duration-200 p-1"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl bg-white/95 border-b border-white/20 shadow-lg">
              <div className="px-6 py-4 space-y-4">
                <a
                  href="#features"
                  className="block text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200 py-2"
                >
                  Features
                </a>
                <a
                  href="#events"
                  className="block text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200 py-2"
                >
                  Events
                </a>
                <a
                  href="#testimonials"
                  className="block text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200 py-2"
                >
                  Testimonials
                </a>
                <button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-teal-500/20 mt-2">
                  Join Brocamp
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  <span>Over 2100 lives transformed</span>
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Unlock Your
                  <span className="block bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Tech Career
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Brototype presents an unconventional path into the tech
                  industry, particularly for individuals without formal IT
                  backgrounds. However, prospective students should exercise
                  caution. It's advisable to thoroughly research the program,
                  understand the financial commitments, and consider alternative
                  learning resources. Engaging with current or former students
                  can provide valuable insights into the program's effectiveness
                  and support structures.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25 flex items-center justify-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button className="group border-2 border-gray-200 hover:border-teal-300 text-gray-700 hover:text-teal-700 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 hover:bg-teal-50/50 flex items-center justify-center">
                  <Play className="h-5 w-5 mr-2 group-hover:text-teal-600" />
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-teal-500/10 rounded-2xl rotate-12 -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-cyan-500/10 rounded-2xl -rotate-12 -z-10"></div>

              <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-3xl shadow-2xl shadow-teal-500/10 p-8 transform hover:shadow-teal-500/15 transition-all duration-300 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900 text-lg">
                    Brocamp 2025
                  </h3>
                  <div className="bg-teal-100 text-teal-700 text-xs font-medium px-2 py-1 rounded-full">
                    Enrolling Now
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Starts January 2026
                      </h3>
                      <p className="text-sm text-gray-600">
                        Multiple Locations & Online
                      </p>
                    </div>
                  </div>

                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/80 p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="text-2xl font-bold text-teal-600">
                        2100+
                      </div>
                      <div className="text-xs text-gray-600">
                        Students Placed
                      </div>
                    </div>
                    <div className="bg-white/80 p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="text-2xl font-bold text-cyan-600">
                        ₹39K
                      </div>
                      <div className="text-xs text-gray-600">Avg Salary</div>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium py-3 rounded-xl transition-all duration-200 transform hover:scale-105">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Everything You Need for a Successful Tech Career
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful programs to kickstart your journey in software
              engineering and tech domains
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group backdrop-blur-xl bg-white/80 border border-white/40 rounded-3xl p-8 shadow-lg shadow-teal-500/5 hover:shadow-teal-500/15 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <button className="text-teal-600 hover:text-teal-700 font-medium flex items-center group-hover:translate-x-2 transition-transform duration-200">
                    Learn more
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section
        id="events"
        className="relative z-10 py-20 px-6 lg:px-8 bg-gradient-to-b from-teal-50/30 to-cyan-50/20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Upcoming Events & Workshops
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our events to learn, network, and advance your tech skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div
                key={index}
                className="group backdrop-blur-xl bg-white/80 border border-white/40 rounded-3xl p-8 shadow-lg shadow-teal-500/5 hover:shadow-teal-500/15 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {event.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRegister(event)}
                    className="text-teal-600 hover:text-teal-700 font-medium flex items-center group-hover:translate-x-2 transition-transform duration-200"
                  >
                    Register Now
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="relative z-10 py-20 px-6 lg:px-8 bg-gradient-to-b from-teal-50/30 to-cyan-50/20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Trusted by Aspiring Tech Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our students are saying about their experience with
              Brototype
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${activeTestimonial * 100}%)`,
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-3xl p-10 shadow-lg shadow-teal-500/10">
                      <div className="flex flex-col md:flex-row items-start gap-8">
                        <div className="flex-shrink-0">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-20 h-20 rounded-full object-cover shadow-md"
                          />
                        </div>
                        <div className="space-y-6">
                          <div className="flex items-center space-x-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-5 w-5 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                          <p className="text-gray-700 text-lg leading-relaxed italic">
                            "{testimonial.content}"
                          </p>
                          <div className="border-t border-gray-100 pt-6">
                            <div className="font-semibold text-gray-900 text-lg">
                              {testimonial.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {testimonial.role}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial navigation */}
            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? "bg-teal-500 scale-125"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-r from-teal-600 to-cyan-600 border border-white/30 rounded-3xl shadow-2xl shadow-teal-500/20 p-12 lg:p-16 text-white overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>

            <div className="relative z-10 text-center space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Ready to Launch Your Tech Career?
              </h2>
              <p className="text-xl text-teal-100 max-w-2xl mx-auto">
                Join thousands of students and build a high-paying career in
                software engineering. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-white/20 flex items-center justify-center">
                  Join Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="border-2 border-white/30 hover:border-white text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200">
                  Schedule a Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-100 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center mr-2">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Brototype
                </h3>
              </div>
              <p className="text-gray-600 max-w-xs">
                The brother you never had - helping you enter the tech industry
                with intensive training.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-500 hover:text-teal-600 transition-colors duration-200"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-teal-600 transition-colors duration-200"
                >
                  <Heart className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-teal-600 transition-colors duration-200"
                >
                  <Share className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Programs</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-gray-600 hover:text-teal-600 transition-colors duration-200"
                >
                  Brocamp
                </a>
                <a
                  href="#"
                  className="block text-gray-600 hover:text-teal-600 transition-colors duration-200"
                >
                  Courses
                </a>
                <a
                  href="#"
                  className="block text-gray-600 hover:text-teal-600 transition-colors duration-200"
                >
                  Domains
                </a>
                <a
                  href="#"
                  className="block text-gray-600 hover:text-teal-600 transition-colors duration-200"
                >
                  Success Stories
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Company</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-gray-600 hover:text-teal-600 transition-colors duration-200"
                >
                  About
                </a>
                <a
                  href="#"
                  className="block text-gray-600 hover:text-teal-600 transition-colors duration-200"
                >
                  Blog
                </a>
                <a
                  href="#"
                  className="block text-gray-600 hover:text-teal-600 transition-colors duration-200"
                >
                  Careers
                </a>
                <a
                  href="#"
                  className="block text-gray-600 hover:text-teal-600 transition-colors duration-200"
                >
                  Contact
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Support</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-gray-600 hover:text-teal-600 transition-colors duration-200"
                >
                  Help Center
                </a>
                <a
                  href="#"
                  className="block text-gray-600 hover:text-teal-600 transition-colors duration-200"
                >
                  Community
                </a>
                <a
                  href="#"
                  className="block text-gray-600 hover:text-teal-600 transition-colors duration-200"
                >
                  FAQs
                </a>
                <a
                  href="#"
                  className="block text-gray-600 hover:text-teal-600 transition-colors duration-200"
                >
                  Status
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-12 pt-8 text-center text-gray-600">
            <p>© 2025 Brototype Pvt Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
