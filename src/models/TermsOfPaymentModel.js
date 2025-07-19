import axiosInstance from "../Data/server/axiosinstance";

const TermsOfPaymentModel = {

  getTermsOfPayments: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id,
      user_types,
      limit,
      page,
      search,
      status,
    });

    return axiosInstance.get(`/settings-term_payment/?${params.toString()}`);
  },

  createTerm: (data) => {
    return axiosInstance.post(`/settings-term_payment/`, data);
  },

  updateTerm: (id, data) => {
    return axiosInstance.put(`/settings-term_payment/${id}/`, data);
  },

  deleteTerm: (id) => {
    return axiosInstance.delete(`/settings-term_payment/${id}/`);
  },

  getBranches: (user_id) => {
    const params = new URLSearchParams({ user_id });
    return axiosInstance.get(`/manage-branch/?${params.toString()}`);
  },
};

export default TermsOfPaymentModel;
