// models/colorModel.js
import axiosInstance from "../Data/server/axiosinstance";

const colorModel = {
  getColors: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id,
      user_types,
      limit,
      page,
      search,
      status,
    });
    return axiosInstance.get(`/manage-colors/?${params.toString()}`);
  },

  createColor: (data) => {
    return axiosInstance.post("/manage-colors/", data);
  },

  updateColor: (id, data) => {
    return axiosInstance.put(`/manage-colors/${id}/`, data);
  },

  deleteColor: (id) => {
    return axiosInstance.delete(`/manage-colors/${id}/`);
  },
};

export default colorModel;
