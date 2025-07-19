import axiosInstance from '../Data/server/axiosinstance';

const employeeModel = {
  // List employees with filters
  getEmployees: (user_id, user_types, limit = 10, page = 1, search = '', status = '') =>
    axiosInstance.get('/employees', {
      params: { user_id, user_types, limit, page, search, status },
    }),

  // Create a new employee
  createEmployee: (payload) =>
    axiosInstance.post('/employees/', payload),

  // Update an employee by ID
  updateEmployee: (id, payload) =>
    axiosInstance.put(`/employees/${id}/`, payload),

  // Delete an employee by ID
  deleteEmployee: (id) =>
    axiosInstance.delete(`/employees/${id}/`),
};

export default employeeModel; 