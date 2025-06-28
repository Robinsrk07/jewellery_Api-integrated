import axiosInstance from '../Data/server/axiosinstance'


const UtilsGetModel ={
    getUtilsData:() => {
        return axiosInstance.get('/get-item-utils/')
    }
}

export default UtilsGetModel