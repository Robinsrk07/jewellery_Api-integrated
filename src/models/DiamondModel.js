import axiosInstance from "../Data/server/axiosinstance";


const DiamondModel ={
    getDiamondItems:(user_types, user_id, limit = 10, page = 1, search = "", status = "")=>{
        const params = new URLSearchParams({
            user_types,
            user_id,
            limit,
            page,
            search,
            status
        })
        return axiosInstance.get(`manage-diamond-items/?${params.toString()}`)
    },

    CreateDiamondItems:(data)=>{
        return axiosInstance.post('manage-diamond-items/',data)
    },
    EditDiamondItem:(data,id)=>{
        return axiosInstance.put(`manage-diamond-items/${id}/`,data)
    },
    DeleteDiamondItem :(uuid)=>{
        return axiosInstance.delete(`manage-diamond-items/${uuid}/`)
    },
    getDiamond:(user_types, user_id, limit = 10, page = 1, search = "", status = "",uuid)=>{
        const params = new URLSearchParams({
            user_types,
            user_id,
            limit,
            page,
            search,
            status,
            diamond_item:uuid
        })
        return axiosInstance.get(`manage-diamond/?${params.toString()}`)
    },
    CreateDiamond:(data)=>{

        return axiosInstance.post(`manage-diamond/`,data)

    },
    UpdateDiamond:(data,uuid)=>{
        return axiosInstance.put(`manage-diamond/${uuid}/`,data)
    }
    
}

export default DiamondModel