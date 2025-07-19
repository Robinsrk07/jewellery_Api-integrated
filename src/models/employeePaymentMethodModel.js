import axiosInstance from '../Data/server/axiosinstance';

const employeePaymentMethodModel = {
  getPaymentMethods: (user_id, user_types, limit, page, search, status) =>
    axiosInstance.get('/employees-paymentmethod/', {
      params: { user_id, user_types, limit, page, search, status },
    }),

  createPaymentMethod: (payload) =>
    axiosInstance.post('/employees-paymentmethod/', payload),

  updatePaymentMethod: (id, payload) =>
    axiosInstance.put(`/employees-paymentmethod/${id}/`, payload),

  deletePaymentMethod: (id) =>
    axiosInstance.delete(`/employees-paymentmethod/${id}/`),
};

export default employeePaymentMethodModel; 