import axiosInstance from "../Data/server/axiosinstance";

const BASE_URL = "/manage-cityarea/";

const CityAreaModel = {
  // List city areas with optional filters
  getCityAreas: (user_id, user_types, limit = 10, page = 1, search = '', status = '') => {
    const params = new URLSearchParams({
      user_id,
      user_types,
      limit,
      page,
      search,
      status,
    });

    return axiosInstance.get(`${BASE_URL}?${params.toString()}`);
  },

  // Create a new city area
  createCityArea: (data) => {
    return axiosInstance.post(BASE_URL, data);
  },

  // Update a city area by ID
  updateCityArea: (id, data) => {
    return axiosInstance.put(`${BASE_URL}${id}/`, data);
  },

  // Delete a city area by ID
  deleteCityArea: (id) => {
    return axiosInstance.delete(`${BASE_URL}${id}/`);
  },
};

export default CityAreaModel;
