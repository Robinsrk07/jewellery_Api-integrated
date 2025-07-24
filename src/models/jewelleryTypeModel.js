import axiosInstance from "../Data/server/axiosinstance";

const JewelleryTypeModel = {
    getJewelleryType:(user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
        const params = new URLSearchParams({
            user_id,
            user_types,
            limit,
            page,
            search,
            status,
        });

        return axiosInstance.get(`/manage-jewellerytype/?${params.toString()}`);
    },
    CreateJewelleryType: (jewellerytypeData) =>{
        return axiosInstance.post('/manage-jewellerytype/',jewellerytypeData);
    },
    updateJewelleryType: (jewellerytypeId, jewellerytypeData) => {
        return axiosInstance.put(`/manage-jewellerytype/${jewellerytypeId}/`, jewellerytypeData);
    },
    deleteJewelleryType: (jewellerytypeId) => {
    return axiosInstance.delete(`/manage-jewellerytype/${jewellerytypeId}/`);
    },
};

export default JewelleryTypeModel;