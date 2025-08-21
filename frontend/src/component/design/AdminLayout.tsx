import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Menu, Bell, Search, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/authSlice";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100">
      <div className="flex min-h-screen">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header
            className={`sticky top-0 z-30 p-4 border-b transition-all duration-300 ${
              isScrolled
                ? "bg-white/90 border-white/40 backdrop-blur-xl shadow-sm"
                : "bg-transparent border-transparent"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-lg bg-white/80 border border-white/40 shadow-sm hover:shadow-md transition-all duration-200 lg:hidden"
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </button>

                {/* Page title for mobile */}
                {title && (
                  <h1 className="text-xl font-bold text-gray-900 lg:hidden">
                    {title}
                  </h1>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {/* User menu */}
                <div className="relative group">
                  <button className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/80 border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200">
                    {/* Avatar Circle */}
                    <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      A
                    </div>

                    {/* Username */}
                    <span className="text-sm font-medium text-gray-800 tracking-wide hidden md:block">
                      Admin
                    </span>
                  </button>

                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-white/40 backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-40">
                    <div className="py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile search bar - visible only on mobile */}
            <div className="mt-3 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/70 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-sm text-gray-700 placeholder-gray-500 backdrop-blur-sm"
                />
              </div>
            </div>
          </header>

          {/* Page title and description for desktop */}
          {(title || description) && (
            <div className="px-6 pt-6 pb-2 hidden lg:block">
              {title && (
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              )}
              {description && (
                <p className="text-gray-600 mt-1">{description}</p>
              )}
            </div>
          )}

          {/* Scrollable content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default AdminLayout;
