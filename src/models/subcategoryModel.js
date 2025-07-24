import axiosInstance from "../Data/server/axiosinstance";

const SubCategoryModel = {
    getSubCategorys:(user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
        const params = new URLSearchParams({
            user_id,
            user_types,
            limit,
            page,
            search,
            status,
        });

        return axiosInstance.get(`/manage-subcategory/?${params.toString()}`);
    },
    CreateSubCategory: (subcategoryData) =>{
        return axiosInstance.post('/manage-subcategory/',subcategoryData);
    },
    updateSubCategory: (subcategoryId, subcategoryData) => {
        return axiosInstance.put(`/manage-subcategory/${subcategoryId}/`, subcategoryData);
    },
    deleteSubCategory: (subcategoryId) => {
    return axiosInstance.delete(`/manage-subcategory/${subcategoryId}/`);
    },
};

export default SubCategoryModel;