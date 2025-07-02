import axiosInstance from "../Data/server/axiosinstance";



const PurchaseFixModel = {
  getPurchaseFixUtils: () => {
    return axiosInstance.get("purchase-fix/")
  },
  getBalancedGoldWeight: (supplierId) => {
    return axiosInstance.get(`get-supplier-balance-weight/?supplier_id=${supplierId}`)
  },
  createPurchseFix:(data) =>{
    return axiosInstance.post(`purchase-fix/`,data)
  },
  getListPurchseFix:(user_id,user_types,limit,page,search,status,supplier_id)=>{
   const params =new URLSearchParams({
    user_id,
    user_types,
    limit,
    page,
    search,
    status,
    supplier_id
   }) 

    return axiosInstance.get(`get-purchase-fix/?${params.toString()}`)
  }
}

export default PurchaseFixModel