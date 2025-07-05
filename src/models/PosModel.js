import axiosInstance from "../Data/server/axiosinstance";


const  POSModel ={
    getItemDetails:(barcode_id,type)=>{
        const params= new URLSearchParams({
            barcode_id,type
        })

        return axiosInstance.get(`get-product-details/?${params.toString()}`)
    },
    CreateCart:(payload)=>{
        return axiosInstance.post( `create-cart/`,payload)
    }
}

export default POSModel