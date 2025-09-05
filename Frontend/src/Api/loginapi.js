import axios from "axios"
export const login=async(loginData)=>{
    try{
    const url="http://localhost:8080/auth/loginUser"
   const {data}=await axios.post(url,loginData,{
    withCredentials:true
   });
   console.log(data)
   return data
    }catch(err){
        console.log(err)
    }

}
export const logout=async()=>{
    try{
        const url="http://localhost:8080/auth/logout"
        const {data}=await axios.post(url,{},{
            withCredentials:true
        });
        console.log(data)
        return data
    }catch(err){
        console.log(err)
}
}

export const userSignUp=async(userData)=>{
    try{
        const url="http://localhost:8080/auth/signup"
        const {data}=await axios.post(url,userData);
         console.log(data);
        return data;
        
    }catch(err){
        console.log(err)
        throw err
    }
}
export const therapistSignUp=async(therapistData)=>{
    const url="http://localhost:8080/auth/Therapist/signup"
     try{
        const {data}=await axios.post(url,therapistData);
         console.log(data);
        return data;
        
    }catch(err){
        console.log(err)
        throw err
    }

}

















