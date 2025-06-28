import axiosInstance from "../Data/server/axiosinstance";


const PurchaseUtils = {
  getPurchaseUtils: ()=>{
    return axiosInstance.get(`/gold-purchase-utils/`);

  }
  
}
export default PurchaseUtils;