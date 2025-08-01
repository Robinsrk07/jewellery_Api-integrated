// models/settingsTaxModel.js


import axiosInstance from "../Data/server/axiosinstance";

const settingsTaxModel = {
  getTaxes: (user_id, user_types, limit, page, search, status ) => {
    const params = new URLSearchParams({
      user_id: user_id, user_types, limit, page, search, status
  
    });
    return axiosInstance.get(`/settings-tax/?${params.toString()}`);
  },

  getBranches: (user_id, user_types, limit, page, search, status ) => {
    const params = new URLSearchParams({
      user_id, user_types, limit, page, search, status
      
    });

    return axiosInstance.get(`/manage-branch/?${params.toString()}`);
  },

  createTax: (data) => {
    return axiosInstance.post("/settings-tax/", data);
  },

  updateTax: (id, data) => {
    return axiosInstance.put(`/settings-tax/${id}/`, data);
  },

  deleteTax: (id) => {
    return axiosInstance.delete(`/settings-tax/${id}/`);
  },
};

export default settingsTaxModel;
