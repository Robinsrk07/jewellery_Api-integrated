import axiosPublicInstance from  '../Data/server/axiosPublicInstance'
import axiosInstance from '../Data/server/axiosinstance'




const AuthModel = {
    login: (email,password,ipAddress)=>{
      return  axiosPublicInstance.post('/login/', {
                 email: email,
                 password: password,
                 ip_address: ipAddress
            })
    },
    logOut:(data)=>{
      return  axiosInstance.post(`/logout/`,data)
    }
}

export default AuthModel