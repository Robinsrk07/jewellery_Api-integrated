import axiosInstance from "../Data/server/axiosinstance";

const BrandModel = {
 
  getBrands: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id : user_id,
      user_types : user_types,
      limit : limit,
      page : page,
      search :search,
      status:status,
    });

    return axiosInstance.get(`/manage-brand/?${params.toString()}`);
  },


  createBrand: (brandData) => {
    return axiosInstance.post("/manage-brand/", brandData);
  },


  updateBrand: (brandId, brandData) => {
    return axiosInstance.put(`/manage-brand/${brandId}/`, brandData);
  },


  deleteBrand: (brandId) => {
    return axiosInstance.delete(`/manage-brand/${brandId}/`);
  },
};

export default BrandModel;
