// models/diamondTypeModel.js

import axiosInstance from "../Data/server/axiosinstance";





const diamondTypeModel = {
  getDiamondTypes: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id: user_id,
      user_types: user_types,
      limit: limit,
      page: page,
      search: search,
      status: status,
    });
    return axiosInstance.get(`/manage-diamondtype/?${params.toString()}`);
  },

  createDiamondType: (data) => {
    return axiosInstance.post("/manage-diamondtype/", data);
  },

  updateDiamondType: (id, data) => {
    return axiosInstance.put(`/manage-diamondtype/${id}/`, data);
  },

  deleteDiamondType: (id) => {
    return axiosInstance.delete(`/manage-diamondtype/${id}/`);
  },
};

export default diamondTypeModel;
