import axiosInstance from "../Data/server/axiosinstance";

const taxCategoryModel = {
  getTaxCategories: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id: user_id,
      user_types: user_types,
      limit: limit,
      page: page,
      search: search,
      status: status,
    });
    return axiosInstance.get(`/supplier-taxcategory/?${params.toString()}`);
  },

  createTaxCategory: (data) => {
    return axiosInstance.post("/supplier-taxcategory/", data);
  },

  updateTaxCategory: (id, data) => {
    return axiosInstance.put(`/supplier-taxcategory/${id}/`, data);
  },

  deleteTaxCategory: (id) => {
    return axiosInstance.delete(`/supplier-taxcategory/${id}/`);
  },
};

export default taxCategoryModel;
