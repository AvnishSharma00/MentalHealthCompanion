import { useContext,createContext,useReducer } from "react";
import { LoginReducer } from "../Reducers/LoginReducer";
const LoginContext=createContext();
const LoginProvider=({children})=>{
    const initialState={
        email:'',
        password:'',
        username:'',
        fullName:'',
        gender:'',
        dob:'',
        phone:'',
        role:'',
        isloggedin:false,
        loading:true,
        specialization:'',
        licenseNumber:'',
        contactNumber:'',
        qualification:''

    }
    const [{email,password,username,fullName,gender,dob,phone,specialization,licenseNumber,contactNumber,qualification,role,isloggedin},loginDispatch]=useReducer(LoginReducer,initialState)
    return(
        <LoginContext.Provider value={{email,password,username,specialization,licenseNumber,contactNumber,qualification,role,fullName,gender,dob,phone,isloggedin,loginDispatch}}>
            {children}
        </LoginContext.Provider>
    )
}
const useLogin=()=>useContext(LoginContext);
 // eslint-disable-next-line react-refresh/only-export-components
 export {LoginProvider,useLogin}