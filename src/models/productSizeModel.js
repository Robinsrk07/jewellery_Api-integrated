// models/productSizeModel.js
import axiosInstance from "../Data/server/axiosinstance";




const productSizeModel = {
  getProductSizes: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id: user_id,
      user_types: user_types,
      limit: limit,
      page: page,
      search: search,
      status: status,
    });
    return axiosInstance.get(`/manage-productsize/?${params.toString()}`);
  },

  createProductSize: (productSizeData) => {
    return axiosInstance.post("/manage-productsize/", productSizeData);
  },

  updateProductSize: (productSizeId, productSizeData) => {
    return axiosInstance.put(`/manage-productsize/${productSizeId}/`, productSizeData);
  },

  deleteProductSize: (productSizeId) => {
    return axiosInstance.delete(`/manage-productsize/${productSizeId}/`);
  },
};

export default productSizeModel;
