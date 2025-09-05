import axios from "axios"

export const setAvailability=async(dataForBackend)=>{
    const url="http://localhost:8080/Therapist/availability"
    try{
        const {data}=await axios.post(url,dataForBackend,{
            withCredentials:true
        });
        console.log(data)
    }catch(err){
        console.log(err)
        throw err
    }
}
export const getAvailability=async()=>{
    const url="http://localhost:8080/Therapy/availability/therapist"
    try{
        const {data}=await axios.get(url,{
            withCredentials:true
        });
        console.log(data)
        return data
    }catch(err){
        console.log(err)
        throw err
    }
}
export const getAppointments = async (status) => {
  const url = "http://localhost:8080/Therapist/appointmentList";

  try {
    const { data } = await axios.get(url, {
      params: { status },   // Pass as query param
      withCredentials: true,
    });
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export const profilePicture=async(profilePicture)=>{
  const url="http://localhost:8080/Therapy/profilePhoto";
  try{
    const {data}=await axios.post(url,profilePicture,{
      withCredentials:true,
      headers:{
        "Content-Type":"multipart/form-data"
      }
    });return data;
  }catch(err){
    console.log(err)
    throw err
  }
}
export const getProfilePicture=async()=>{
  const url="http://localhost:8080/Therapy/getProfilePhoto";
  try{
    const {data}=await axios.get(url,
      {withCredentials:true}
    );
    console.log(data);
     return data;
  }catch(err){
    console.log(err)
    throw err
  }
}
export const getTherapistById=async(id)=>{
  const url=`http://localhost:8080/Therapy/getTherapistById/${id}`
   try{
    const {data}=await axios.get(url,
      {withCredentials:true}
    );
    console.log(data);
     return data;
  }catch(err){
    console.log(err)
    throw err
  }

}
export const getTherapistAvailabilityById=async(id)=>{
  const url=`http://localhost:8080/Therapy/availability/therapist/${id}`
    try{
    const {data}=await axios.get(url,
      {withCredentials:true}
    );
    console.log(data);
     return data;
  }catch(err){
    console.log(err)
    throw err
  }
}
export const bookAppointment=async(appointmentData)=>{
  const url="http://localhost:8080/Therapy/appointments/book"
    try{
    const {data}=await axios.post(url,appointmentData,
      {withCredentials:true}
    );
    console.log(data);
     return data;
  }catch(err){
    console.log(err)
    throw err
  }

}