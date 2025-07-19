// models/supplierModel.js

import axiosInstance from "../Data/server/axiosinstance";

const supplierModel = {
  getSuppliers: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id: user_id,
    //   user_types: user_types,
    //   limit: limit,
    //   page: page,
    //   search: search,
    //   status: status,
    });

    return axiosInstance.get(`/manage-supplier/?${params.toString()}`);
  },

  createSupplier: (data) => {
    return axiosInstance.post("/manage-supplier/", data);
  },


 getControlAccounts: (user_id, user_types, ) => {
    const params = new URLSearchParams({
      user_id: user_id,
    //   user_types: user_types,
    //   limit: limit,
    //   page: page,
    //   search: search,
    //   status: status,
    });
    return axiosInstance.get(`/supplier-controlaccount/?${params.toString()}`);
  },

  getTaxCategories: (user_id, user_types) => {
    const params = new URLSearchParams({
      user_id,
      // user_types,
      
    });

    return axiosInstance.get(`/supplier-taxcategory/?${params.toString()}`);
  },

  getAddressTypes: (user_id, user_types) => {
    const params = new URLSearchParams({
      user_id,
      // user_types,
      
    });

    return axiosInstance.get(`/manage-address-type/?${params.toString()}`);
  },

  getCountries: (user_id, user_types) => {
    const params = new URLSearchParams({
      user_id,
      // user_types,
    });

    return axiosInstance.get(`/manage-countries/?${params.toString()}`);
  },



    getCities:(user_id, user_types) =>{
        const params =new URLSearchParams(
            {
             user_id,
              
            }
        )
        return axiosInstance.get(`manage-cities/?${params.toString()}`)
    },


 getCurrency: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id,
      user_types,
      limit,
      page,
      search,
      status,
    });

    return axiosInstance.get(`/settings-currency/?${params.toString()}`);
  },




getControlAccounts: (userId) => {
  return axiosInstance.get(`/supplier-controlaccount/?user_id=${userId}`);
},



  updateSupplier: (id, data) => {
    return axiosInstance.put(`/manage-supplier/${id}/`, data);
  },

  deleteSupplier: (id) => {
    return axiosInstance.delete(`/manage-supplier/${id}/`);
  },
};

export default supplierModel;
