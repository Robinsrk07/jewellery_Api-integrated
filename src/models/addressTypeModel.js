import axiosInstance from "../Data/server/axiosinstance";

const addressTypeModel = {
 getAddressTypes: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
     user_id: user_id,
     user_types: user_types,
     limit: limit,
     page: page,
     search: search,
     status: status
    });
    return axiosInstance.get(`/manage-address-type/?${params.toString()}`);
  },

  
  createAddressTypes: (addressdata) =>{
    return axiosInstance.post("/manage-address-type/", addressdata);
  } ,
    

  updateAddressTypes: (addressId, addressData) => {
    return axiosInstance.put(`/manage-address-type/${addressId}/`, addressData);
},


deleteAddress: (id) => axiosInstance.delete(`/manage-address-type/${id}/`)

};

export default addressTypeModel;
