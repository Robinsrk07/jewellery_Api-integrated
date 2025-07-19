import axiosInstance from "../Data/server/axiosinstance";

const supplierGroupModel = {
  getSupplierGroups: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id : user_id,
      user_types : user_types,
      limit : limit,
      page : page,
      search:search,
      status:status,
    });
    return axiosInstance.get(`/supplier-suppliergroup/?${params.toString()}`);
  },

  createSupplierGroup: (data) => {
    return axiosInstance.post("/supplier-suppliergroup/", data);
  },

  updateSupplierGroup: (id, data) => {
    return axiosInstance.put(`/supplier-suppliergroup/${id}/`, data);
  },

  deleteSupplierGroup: (id) => {
    return axiosInstance.delete(`/supplier-suppliergroup/${id}/`);
  },
};

export default supplierGroupModel;
