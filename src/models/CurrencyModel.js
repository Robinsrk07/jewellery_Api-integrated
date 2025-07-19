import axiosInstance from "../Data/server/axiosinstance";


const CurrencyModel = {
  getCurrency: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id,
      user_types,
      limit,
      page,
      search,
      status,
    });

    return axiosInstance.get(`/settings-currency/?${params.toString()}`);
  },
  createCurrency: (data) => {
      return axiosInstance.post("/settings-currency/", data);
    },
  
    
    updateCurrency: (id, data) => {
      return axiosInstance.put(`/settings-currency/${id}/`, data);
    },
  
  
    deleteCurrency: (id) => {
      return axiosInstance.delete(`/settings-currency/${id}/`);
    }
}

export default CurrencyModel