import axiosInstance from "../Data/server/axiosinstance";


const GoldItemModel={
    getGoldItem: (user_type, user_id, limit = 10, page = 1, search = "", status = "") => {
         const params = new URLSearchParams({
            user_types: user_type,
            user_id: user_id,
            limit: limit,
            page: page,
            search: search,
            status: status})


       return axiosInstance.get(`/gold-items/?${params.toString()}`);
    }
}

export default GoldItemModel;