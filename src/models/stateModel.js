import axiosInstance from "../Data/server/axiosinstance";

const StateModel = {
  // List states with filters
  getStates: (user_id, user_types, limit = 10, page = 1, search = '', status = '') => {
    const params = new URLSearchParams({
      user_id,
      user_types,
      limit,
      page,
      search,
      status,
    });

    return axiosInstance.get(`/manage-state/?${params.toString()}`);
  },

  // Create a new state
  createState: (data) => {
    return axiosInstance.post("/manage-state/", data);
  },

  // Update a state by ID
  updateState: (id, data) => {
    return axiosInstance.put(`/manage-state/${id}/`, data);
  },

  // Delete a state by ID
  deleteState: (id) => {
    return axiosInstance.delete(`/manage-state/${id}/`);
  },
};

export default StateModel;
