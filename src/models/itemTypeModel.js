import axiosInstance from "../Data/server/axiosinstance";

const ItemTypeModel = {
    getItemTypes:(user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
        const params = new URLSearchParams({
            user_id,
            user_types,
            limit,
            page,
            search,
            status,
        });

        return axiosInstance.get(`/item-type/?${params.toString()}`);
    },
    CreateItemType: (itemTypeData) =>{
        return axiosInstance.post('/item-type/',itemTypeData);
    },
    updateItemType: (itemtypeId, itemTypeData) => {
        return axiosInstance.put(`/item-type/${itemtypeId}/`, itemTypeData);
    },
    deleteItemType: (itemtypeId) => {
    return axiosInstance.delete(`/item-type/${itemtypeId}/`);
    },
};

export default ItemTypeModel;