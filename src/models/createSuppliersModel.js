// src/models/supplierModel.js

import axiosInstance from "../Data/server/axiosinstance";

const createSupplierModel = {
  getSupplierGroups: (user_id, user_types) => {
    const params = new URLSearchParams({
      user_id,
      // user_types,
    });

    return axiosInstance.get(`/supplier-suppliergroup/?${params.toString()}`);
  },

  getControlAccounts: (user_id, user_types) => {
    const params = new URLSearchParams({
      user_id,
      // user_types,
      
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


 getCurrencies: (user_id) => {
  const params = new URLSearchParams({ user_id });

  return axiosInstance.get(`/settings-currency/?${params.toString()}`);
},


};

export default createSupplierModel;
