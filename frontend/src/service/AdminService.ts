import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const toggleUserStatusService = async (userId: string) => {
  const response = await axios.patch(`${API_URL}/${userId}/toggle-status`);
  return response.data;
};

export const fetchUsersService = async () => {
  const response = await axios.get(`${API_URL}/user-list`);
  return response.data; 
};