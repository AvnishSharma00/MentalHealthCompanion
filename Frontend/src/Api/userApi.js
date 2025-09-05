import axios from "axios";

export const userDetail=async()=>{
    const url="http://localhost:8080/Therapy/UserDetail"
    try{
        const {data}=await axios.get(url,{
            withCredentials:true
        })
        console.log(data)
        return data
    }catch(err){
        console.log(err)
        throw err
    }

}
export const updateUser=async(updateData)=>{
    const url="http://localhost:8080/Therapy/updateProfile"
    try{
        const {data}=await axios.put(url,updateData,{
            withCredentials:true
        });
        console.log(data)
        return data;
    }catch(err){
        console.log(err)
        throw err
    }
}