import api from "./api";

export const adminApi = {
  // Fetch all users
  getUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  // Promote user to admin
  promoteUser: async (id: string) => {
    const response = await api.post(`/admin/users/${id}/promote`);
    return response.data;
  },

  // Get platform analytics
  getAnalytics: async () => {
    const response = await api.get("/admin/analytics");
    return response.data;
  },
};
