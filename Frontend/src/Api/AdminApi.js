import axios from "axios"

export const getAllTherapist=async()=>{
try{
    const url="http://localhost:8080/Therapy/getAllTherapist"
    const data=await axios.get(url,{
         withCredentials:true
    });
    console.log(data)
    return data
}catch(err){
    console.log(err)
}
}
export const getAllTherapistForAdmin=async()=>{
    const url="http://localhost:8080/Admin/getAllTherapistForAdmin";
    try{
        const data=await axios.get(url,{
            withCredentials:true
        });
        console.log(data);
        return data;
    }catch(err){
        console.log(err)
        throw err
    }
}
export const getAllUserForAdmin=async()=>{
    const url="http://localhost:8080/Admin/getAllUser";
    try{
        const {data}=await axios.get(url,{
            withCredentials:true
        });
        console.log(data);
        return data;
    }catch(err){
        console.log(err)
    }
}
export const makeUserAdmin=async(id)=>{
    const url=`http://localhost:8080/Admin/make-admin/${id}`
    try{
        const {data}=await axios.put(url,{},{
            withCredentials:true
        })
        console.log(data)
        return data;
    }catch(err){
        console.log(err)
    }

}
export const rejectOrApprovedApi=async(id,status)=>{
    const url=`http://localhost:8080/Admin/therapists/${id}/status`
    try{
        const {data}=await axios.put(url,{status},{
            withCredentials:true
        });
        console.log(data)
        return data
    }catch(err){
        console.log(err)
    }
}
export const getTherapistData=async()=>{
    const url="http://localhost:8080/Therapist/getTherapistProfile"
    try{
        const {data}=await axios.get(url,{
            withCredentials:true
        })
        console.log(data)
        return data
    }catch(err){
        console.log(err)
    }
}