import axiosInstance from "../Data/server/axiosinstance";

const BranchModel = {
  getBranches: (user_id, user_types='', limit = 10, page = 1, search = '', status = '') => {
    const params = new URLSearchParams({
      user_id,
      user_types,
      limit,
      page,
      search,
      status,
    });

    return axiosInstance.get(`manage-branch/?${params.toString()}`);
  },

  createBranch: (data) => {
    return axiosInstance.post('manage-branch/', data);
  },

  updateBranch: (id, data) => {
    return axiosInstance.put(`manage-branch/${id}/`, data);
  },

  deleteBranch: (id) => {
    return axiosInstance.delete(`manage-branch/${id}/`);
  },
  assignEmployee:(data)=>{
     return axiosInstance.post(`branch-employee-assign/`,data)
  },
  getEmployeeAssign :()=>{
    return axiosInstance.get(`branch-employee-assign/`)
  }
};

export default BranchModel;
