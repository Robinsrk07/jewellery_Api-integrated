// models/occasionModel.js
import axiosInstance from "../Data/server/axiosinstance";

const occasionModel = {
  getOccasions: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id : user_id,
      user_types : user_types,
      limit :limit,
      page:page,
      search :search,
      status :status,
    });
    return axiosInstance.get(`/manage-occasion/?${params.toString()}`);
  },

  createOccasion: (data) => {
    return axiosInstance.post("/manage-occasion/", data);
  },

  updateOccasion: (id, data) => {
    return axiosInstance.put(`/manage-occasion/${id}/`, data);
  },

  deleteOccasion: (id) => {
    return axiosInstance.delete(`/manage-occasion/${id}/`);
  },
};

export default occasionModel;
