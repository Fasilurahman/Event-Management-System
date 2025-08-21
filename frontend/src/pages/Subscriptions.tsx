import React, { useEffect, useState } from 'react';
import { 
  Download,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Crown,
  Zap
} from 'lucide-react';
import AdminLayout from '../component/design/AdminLayout';
import { fetchAllTicketsService } from '../service/TicketService';


interface Subscription {
  id: string;
  userId: string;
  userName: string;
  plan: 'free' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  amount: number;
  nextBilling: string;
}



function Subscriptions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subscriptions, setSubscriptions] = useState<any[]>([]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-600 bg-emerald-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'expired': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSubscriptionIcon = (plan: string) => {
    switch (plan) {
      case 'free': return <User className="h-4 w-4" />;
      case 'premium': return <Crown className="h-4 w-4" />;
      case 'enterprise': return <Zap className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };
  

  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );



  useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await fetchAllTicketsService();
      const formatted = data.map((t: any) => ({
        id: t._id,
        userName: t.userId?.name,
        userId: t.userId?._id,
        plan: t.eventId?.title || "N/A",
        status: t.status,
        amount: t.eventId?.price || 0,
        nextBilling: new Date(t.purchaseDate).toLocaleDateString(),
      }));
      console.log(formatted,'formated');
      setSubscriptions(formatted);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    }
  };
  fetchData();
}, []);

  return (
    <AdminLayout>
    <div className="space-y-6">
      {/* Subscriptions Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Ticket Management</h3>
          <p className="text-gray-600 mt-1">Monitor subscription plans and billing</p>
        </div>
        <div className="flex items-center space-x-3">

        </div>
      </div>

      {/* Subscription Stats */}
      

      {/* Subscriptions Table */}
      <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50 border-b border-white/40">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">User</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Plan</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-white/30 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{subscription.userName}</div>
                    <div className="text-sm text-gray-500">ID: {subscription.userId}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                     
                      <span className="capitalize font-medium text-gray-900">{subscription.plan}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                      {subscription.status === 'active' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : subscription.status === 'cancelled' ? (
                        <XCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                      {subscription.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900">${subscription.amount}</span>
                    <span className="text-sm text-gray-500">/month</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{subscription.nextBilling}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default Subscriptions;