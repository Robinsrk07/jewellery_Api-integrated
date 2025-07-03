import axiosInstance from "../Data/server/axiosinstance";

const CategoryModel = {
    getCategorys:(user_id, user_types, limit = 10, page = 1, search = "", status = "") => {
        const params = new URLSearchParams({
            user_id,
            user_types,
            limit,
            page,
            search,
            status,
        });

        return axiosInstance.get(`/manage-category/?${params.toString()}`);
    },
    CreateCategory: (categoryData) =>{
        return axiosInstance.post('/manage-category/',categoryData);
    },
    updateCategory: (categoryId, categoryData) => {
        return axiosInstance.put(`/manage-category/${categoryId}/`, categoryData);
    },
    deleteCategory: (categoryId) => {
    return axiosInstance.delete(`/manage-category/${categoryId}/`);
    },
};

export default CategoryModel;