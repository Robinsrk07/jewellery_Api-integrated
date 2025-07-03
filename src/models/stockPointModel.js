// models/stockPointModel.js
import axiosInstance from "../Data/server/axiosinstance";

const stockPointModel = {
  getStockPoints: (user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
    const params = new URLSearchParams({
      user_id : user_id,
      user_types :user_types,
      limit:limit,
      page:page,
      search:search,
      status:status,
    });
    return axiosInstance.get(`/stock-point/?${params.toString()}`);
  },

  createStockPoint: (StockPointdata) => {
    return axiosInstance.post("/stock-point/",StockPointdata);
  },
  
  updateStockPoint: (StockPointId, StockPointdata) => {
    return axiosInstance.put(`/stock-point/${StockPointId}/`, StockPointdata); 
  },


  deleteStockPoint: (StockPointId) => {
    return axiosInstance.delete(`/stock-point/${StockPointId}/`);
  },

};

export default stockPointModel;
