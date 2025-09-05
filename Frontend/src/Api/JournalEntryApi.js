import axios from "axios";
export const getEntries=async()=>{
     try{
        const url="http://localhost:8080/Journal/allEntries"
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
export const createJournal=async(createData)=>{
    try{
        const url="http://localhost:8080/Journal/create"
        const {data}=await axios.post(url,createData,{
            withCredentials:true
        });
        console.log(data)
        return data;
    }catch(err){
        console.log(err)
    }
}
export const deleteJournalEntry=async(id)=>{
    const url=`http://localhost:8080/Journal/remove-entry/${id}`
    try{
        const {data}= await axios.delete(url,{
            withCredentials:true
        })
        console.log(data)
    }catch(err){
        console.log(err)
        throw err
    }
}