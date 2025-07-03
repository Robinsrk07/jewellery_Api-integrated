import axiosInstance from "../Data/server/axiosinstance";



const returnTypeModel = {
  getReturnTypes: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id: user_id,
      user_types: user_types,
      limit: limit,
      page: page,
      search: search,
      status: status,
    });
    return axiosInstance.get(`/return-type/?${params.toString()}`);
  },

  createReturnType: (returntype) => {
    return axiosInstance.post(`/return-type/`, returntype);
  },

 updateReturnType: (id, updatedData) => {
    return axiosInstance.put(`/return-type/${id}/`, updatedData);
  },

  deleteReturnType: (id) => {
    return axiosInstance.delete(`/return-type/${id}/`);
  }

};

export default returnTypeModel;
