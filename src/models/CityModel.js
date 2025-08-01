import axiosInstance from "../Data/server/axiosinstance";


const CityModel ={
    getCities:(user_id, user_types, limit = 10, page = 1, search = "", status = "") =>{
        const params =new URLSearchParams(
            {
             user_id,
             user_types,
             limit,
             page,
             search,
             status,  
            }
        )
        return axiosInstance.get(`manage-cities/?${params.toString()}`)
    },

    CreateCity:(data)=>{
          return axiosInstance.post('manage-cities/',data)
    },
    EditCity:(id,data)=>{
        return axiosInstance.put(`manage-cities/${id}/`,data)
    },
    DeleteCity:(id)=>{
        return axiosInstance.delete(`manage-cities/${id}/`)
    }
}

export default CityModel