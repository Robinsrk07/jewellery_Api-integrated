// models/stoneTypeModel.js

import axiosInstance from "../Data/server/axiosinstance";

const stoneTypeModel = {
  getStoneTypes: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id: user_id,
      user_types: user_types,
      limit: limit,
      page: page,
      search: search,
      status: status,
    });
    return axiosInstance.get(`/manage-stonetype/?${params.toString()}`);
  },

  createStoneType: (data) => {
    return axiosInstance.post("/manage-stonetype/", data);
  },

  updateStoneType: (id, data) => {
    return axiosInstance.put(`/manage-stonetype/${id}/`, data);
  },

  deleteStoneType: (id) => {
    return axiosInstance.delete(`/manage-stonetype/${id}/`);
  },
};

export default stoneTypeModel;
