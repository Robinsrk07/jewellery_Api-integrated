// models/controlAccountModel.js
import axiosInstance from "../Data/server/axiosinstance";

const controlAccountModel = {
  getControlAccounts: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id: user_id,
      user_types: user_types,
      limit: limit,
      page: page,
      search: search,
      status: status,
    });
    return axiosInstance.get(`/supplier-controlaccount/?${params.toString()}`);
  },

  createControlAccount: (data) => {
    return axiosInstance.post("/supplier-controlaccount/", data);
  },

  updateControlAccount: (id, data) => {
    return axiosInstance.put(`/supplier-controlaccount/${id}/`, data);
  },

  deleteControlAccount: (id) => {
    return axiosInstance.delete(`/supplier-controlaccount/${id}/`);
  },
};

export default controlAccountModel;
