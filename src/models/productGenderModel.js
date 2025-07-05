// models/productGenderModel.js
import axiosInstance from "../Data/server/axiosinstance";

const productGenderModel = {

  getProductGenders: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id,
      user_types,
      limit,
      page,
      search,
      status,
    });
    return axiosInstance.get(`/manage-productgender/?${params.toString()}`);
  },


  createProductGender: (genderData) => {
    return axiosInstance.post("/manage-productgender/", genderData);
  },


  updateProductGender: (genderId, genderData) => {
    return axiosInstance.put(`/manage-productgender/${genderId}/`, genderData);
  },


  deleteProductGender: (genderId) => {
    return axiosInstance.delete(`/manage-productgender/${genderId}/`);
  },
};

export default productGenderModel;
