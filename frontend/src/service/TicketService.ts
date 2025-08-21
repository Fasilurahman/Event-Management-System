import api from "../api/axiosInstance";

export const fetchTicketsService = async (): Promise<any> => {
  const response = await api.get(`/api/tickets/details`);
  return response.data;
};

export const fetchUserService = async (userId: string): Promise<any> => {
  const response = await api.get(`/api/users/${userId}`);
  return response.data;
};

export const fetchAllTicketsService = async () => {
  const response = await api.get("api/tickets/all");
  return response.data;
};

export const verifyTicketService = async (ticketId: string) => {
  console.log(ticketId);
  const response = await api.get(`/api/tickets/verify/${ticketId}`);
  return response.data;
};