import axiosInstance from "../Data/server/axiosinstance";

const UOMModel = {
  
  getUOMs: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id,
      user_types,
      limit,
      page,
      search,
      status,
    });

    return axiosInstance.get(`/settings-uom/?${params.toString()}`);
  },

 
  createUOM: (data) => {
    return axiosInstance.post("/settings-uom/", data);
  },

 
  updateUOM: (id, data) => {
    return axiosInstance.put(`/settings-uom/${id}/`, data);
  },

  
  deleteUOM: (id) => {
    return axiosInstance.delete(`/settings-uom/${id}/`);
  },


  getBranches: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({user_id, user_types, limit , page, search , status});
    return axiosInstance.get(`/manage-branch/?${params.toString()}`);
  },
};

export default UOMModel;
