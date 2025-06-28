import axiosInstance from "../Data/server/axiosinstance";


const PurchaseModel = {
  getPurchases: (user_id, user_types, limit = 10, page = 1, search = "") => {
    const params = new URLSearchParams({
      user_id,
      user_types,
      limit,
      page,
      search,
    });
    return axiosInstance.get(`/get-gold-purchase-master/?${params.toString()}`);
  },
  getPurchaseList:(user_id, user_types, limit = 10, page = 1, search = "",status='',id)=>{
      const params = new URLSearchParams({
        user_id,
      user_types,
      limit,
      page,
      search,
      status
      })

    return axiosInstance.get(`/get-gold-purchase-list/${id}/?${params.toString()}`)
  },
  
  createPurchase: (purchaseData) => {
    return axiosInstance.post('/gold-purchase/', purchaseData);
  },
  EditPurchase:(editPurchaseData,id)=>{
    console.log("idtest",id)
    return axiosInstance.put(`/update-gold-purchase/${id}/`,editPurchaseData)
  }
};

export default PurchaseModel;