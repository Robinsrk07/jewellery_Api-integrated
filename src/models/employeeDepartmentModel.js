import axiosInstance from '../Data/server/axiosinstance';

const employeeDepartmentModel = {
  getDepartments: (user_id, user_types, limit, page, search, status) =>
    axiosInstance.get('/employees-department', {
      params: { user_id, user_types, limit, page, search, status },
    }),

  createDepartment: (payload) =>
    axiosInstance.post('/employees-department/', payload),

  updateDepartment: (id, payload) =>
    axiosInstance.put(`/employees-department/${id}/`, payload),

  deleteDepartment: (id) =>
    axiosInstance.delete(`/employees-department/${id}/`),
};

export default employeeDepartmentModel; 