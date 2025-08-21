import { 
  Home,
  Calendar,
  CreditCard,
  Settings,
  Users,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const location = useLocation();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin/dashboard' },
    { id: 'events', label: 'Events', icon: Calendar, path: '/admin/events' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'Tickets', label: 'Subscriptions', icon: CreditCard, path: '/admin/subscriptions' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 min-h-screen w-64 bg-white/90 backdrop-blur-xl border-r border-white/40 shadow-xl
        transform transition-transform duration-300 z-50 lg:static lg:min-h-0 lg:h-auto lg:flex-shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/40 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/50 transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1 flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
              
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-white/50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;