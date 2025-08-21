import  { useEffect, useState } from "react";
import {
  Shield,
  ShieldOff,
  Eye,
  CheckCircle,
  XCircle,
  User,
  Crown,
  Zap,
} from "lucide-react";
import {
  fetchUsersService,
  toggleUserStatusService,
} from "../service/AdminService";
import AdminLayout from '../component/design/AdminLayout';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "active" | "blocked";
  subscription: "free" | "premium" | "enterprise";
  joinDate: string;
  lastActive: string;
}


function Users() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchUsersService();
        console.log(data, "user datas");
        setUsers(data.users);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const toggleUserStatus = async (userId: string) => {
    try {
      console.log("Toggling user status for user ID:", userId);
      const res = await toggleUserStatusService(userId);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
        )
      );
    } catch (err: any) {
      console.error(
        "Error updating user status:",
        err.response?.data || err.message
      );
    }
  };
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "active":
//         return "text-emerald-600 bg-emerald-50";
//       case "blocked":
//         return "text-red-600 bg-red-50";
//       default:
//         return "text-gray-600 bg-gray-50";
//     }
//   };

  const getSubscriptionIcon = (plan: string) => {
    switch (plan) {
      case "free":
        return <User className="h-4 w-4" />;
      case "premium":
        return <Crown className="h-4 w-4" />;
      case "enterprise":
        return <Zap className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

//   const filteredUsers = users.filter(
//     (user) =>
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

  return (
    <AdminLayout >
    <div className="space-y-6">
      {/* Users Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
          <p className="text-gray-600 mt-1">Manage and monitor user accounts</p>
        </div>

      </div>

      {/* Users Table */}
      <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/50 border-b border-white/40">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  User
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Status
                </th>

                {/* <th className="text-left py-4 px-6 font-semibold text-gray-900">Join Date</th> */}
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {users
                .filter(
                  (user) =>
                    user.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-white/30 transition-colors duration-200"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold uppercase">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.isBlocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.isBlocked ? (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Blocked
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        )}
                      </span>
                    </td>
                    {/* <td className="py-4 px-6 text-gray-600">{user.joinDate}</td> */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleUserStatus(user._id)}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            !user.isBlocked
                              ? "text-red-600 hover:bg-red-50"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={
                            !user.isBlocked ? "Block User" : "Unblock User"
                          }
                        >
                          {!user.isBlocked ? (
                            <ShieldOff className="h-4 w-4" />
                          ) : (
                            <Shield className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}

export default Users;
