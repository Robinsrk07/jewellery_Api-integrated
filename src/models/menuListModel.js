import axiosInstance from '../Data/server/axiosinstance'




const MenuListModel ={
    getMenuList:() => {
        return axiosInstance.get('/menu-list/')
    }
}

export default MenuListModel