import axiosPublicInstance from  '../Data/server/axiosPublicInstance'




const AuthModel = {
    login: (email,password,ipAddress)=>{
      return  axiosPublicInstance.post('/login/', {
                 email: email,
                 password: password,
                 ip_address: ipAddress
            })
    }
}

export default AuthModel