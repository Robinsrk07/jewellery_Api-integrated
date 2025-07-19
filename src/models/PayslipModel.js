import axiosInstance from "../Data/server/axiosinstance";

const PayslipModel ={
    createPayslip:(data)=>{
        return axiosInstance.post('/payslips/',data)
    },
    getPayslip:(user_id, user_types, limit = 100, page = 1, search = "", status = "")=>{
         const params = new URLSearchParams({
            user_id,
            user_types,
            limit,
            page,
            search,
            status
         })
         return  axiosInstance.get(`/payslips/?${params.toString()}`)
    },
    deletePayslip:(id)=>{
        console.log(id )
        return axiosInstance.delete(`/payslips/${id}`)
    },
    updatePayslip:(data,id)=>{
        return axiosInstance.put(`/payslips/${id}/`,data)
    }
}

export default PayslipModel