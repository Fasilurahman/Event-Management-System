import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  CreditCard,
  UserCheck,
  Plus,
  Settings,
  Activity,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import AdminLayout from '../component/design/AdminLayout';
import { useState, useEffect } from 'react';

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: 'Total Users',
      value: '12,543',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10'
    },
    {
      title: 'Active Events',
      value: '89',
      change: '+8%',
      trend: 'up',
      icon: Calendar,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10'
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: '+23%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10'
    },
    {
      title: 'Subscriptions',
      value: '3,421',
      change: '-2%',
      trend: 'down',
      icon: CreditCard,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-br from-orange-500/10 to-red-500/10'
    }
  ];

  const recentActivity = [
    { user: 'Sarah Johnson', action: 'upgraded to Premium', time: '2 hours ago', type: 'upgrade' },
    { user: 'Michael Chen', action: 'registered for Tech Conference', time: '4 hours ago', type: 'event' },
    { user: 'Emma Wilson', action: 'account blocked', time: '1 day ago', type: 'block' },
    { user: 'David Rodriguez', action: 'subscription renewed', time: '2 days ago', type: 'subscription' }
  ];

  const quickActions = [
    { title: 'Add User', icon: UserCheck, color: 'from-blue-500 to-cyan-500' },
    { title: 'Create Event', icon: Plus, color: 'from-emerald-500 to-teal-500' },
    { title: 'View Reports', icon: Activity, color: 'from-purple-500 to-pink-500' },
    { title: 'Settings', icon: Settings, color: 'from-orange-500 to-red-500' }
  ];

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl p-6 shadow-lg animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200/50 rounded w-24"></div>
                <div className="h-8 bg-gray-200/50 rounded w-20"></div>
                <div className="flex items-center">
                  <div className="h-4 bg-gray-200/50 rounded w-16"></div>
                </div>
              </div>
              <div className="h-12 w-12 bg-gray-200/50 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl p-6 shadow-lg animate-pulse">
          <div className="h-6 bg-gray-200/50 rounded w-32 mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-3">
                <div className="h-10 w-10 bg-gray-200/50 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200/50 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200/50 rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-gray-200/50 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl p-6 shadow-lg animate-pulse">
          <div className="h-6 bg-gray-200/50 rounded w-32 mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-24 bg-gray-200/50 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <SkeletonLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}

      <h1>Dummy Content to Watch</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
            >
              {/* Animated background element */}
              <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ml-1 ${
                      stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {stat.change} from last week
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-sm text-blue-500 hover:text-blue-700 flex items-center">
                View all <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/50 transition-all duration-200 group hover:shadow-sm"
                >
                  <div className={`p-2.5 rounded-lg shadow-sm ${
                    activity.type === 'upgrade' ? 'bg-emerald-100 text-emerald-600' :
                    activity.type === 'event' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'block' ? 'bg-red-100 text-red-600' :
                    'bg-purple-100 text-purple-600'
                  } group-hover:scale-105 transition-transform duration-200`}>
                    {activity.type === 'upgrade' ? <TrendingUp className="h-4 w-4" /> :
                    activity.type === 'event' ? <Calendar className="h-4 w-4" /> :
                    activity.type === 'block' ? <Users className="h-4 w-4" /> :
                    <CreditCard className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.user}</p>
                    <p className="text-xs text-gray-500 truncate">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-gray-100">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden`}
                >
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-white/20"></div>
                  
                  <action.icon className="h-6 w-6 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200 relative z-10" />
                  <p className="text-sm font-medium relative z-10">{action.title}</p>
                </button>
              ))}
            </div>
            
            {/* Additional metrics section */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-4">System Status</h4>
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-emerald-600 font-bold">98%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Uptime</p>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-blue-600 font-bold">2.1s</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Response</p>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-purple-600 font-bold">0.2%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Errors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;