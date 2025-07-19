import axiosInstance from '../Data/server/axiosinstance';

const employeeGenderModel = {
  getGenders: (user_id, user_types, limit, page, search, status) =>
    axiosInstance.get('/employees-gender/', {
      params: { user_id, user_types, limit, page, search, status },
    }),

  createGender: (payload) =>
    axiosInstance.post('/employees-gender/', payload),

  updateGender: (id, payload) =>
    axiosInstance.put(`/employees-gender/${id}/`, payload),

  deleteGender: (id) =>
    axiosInstance.delete(`/employees-gender/${id}/`),
};

export default employeeGenderModel; 