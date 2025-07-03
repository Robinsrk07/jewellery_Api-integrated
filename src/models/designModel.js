// models/designModel.js
import axiosInstance from "../Data/server/axiosinstance";

const designModel = {
  getDesigns: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id: user_id,
      user_types: user_types,
      limit: limit,
      page: page,
      search: search,
      status: status,
    });
    return axiosInstance.get(`/manage-design/?${params.toString()}`);
  },

  createDesign: (designData) => {
    return axiosInstance.post("/manage-design/", designData);
  },

  updateDesign: (designId, designData) => {
    return axiosInstance.put(`/manage-design/${designId}/`, designData);
  },

  deleteDesign: (designId) => {
    return axiosInstance.delete(`/manage-design/${designId}/`);
  },
};

export default designModel;
