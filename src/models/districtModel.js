import axiosInstance from "../Data/server/axiosinstance";

const DistrictModel = {
  // List districts with filters
  getDistricts: (user_id, user_types, limit = 10, page = 1, search = '', status = '') => {
    const params = new URLSearchParams({
      user_id,
      user_types,
      limit,
      page,
      search,
      status,
    });

    return axiosInstance.get(`/manage-district/?${params.toString()}`);
  },

  // Create a new district
  createDistrict: (data) => {
    return axiosInstance.post(`/manage-district/`, data);
  },

  // Update a district by ID
  updateDistrict: (id, data) => {
    return axiosInstance.put(`/manage-district/${id}/`, data);
  },

  // Delete a district by ID
  deleteDistrict: (id) => {
    return axiosInstance.delete(`/manage-district/${id}/`);
  },
};

export default DistrictModel;
