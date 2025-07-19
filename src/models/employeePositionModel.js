import axiosInstance from '../Data/server/axiosinstance';

const employeePositionModel = {
  getPositions: (user_id, user_types, limit, page, search, status) =>
    axiosInstance.get('/employees-position/', {
      params: { user_id, user_types, limit, page, search, status },
    }),

  createPosition: (payload) =>
    axiosInstance.post('/employees-position/', payload),

  updatePosition: (id, payload) =>
    axiosInstance.put(`/employees-position/${id}/`, payload),

  deletePosition: (id) =>
    axiosInstance.delete(`/employees-position/${id}/`),
};

export default employeePositionModel; 