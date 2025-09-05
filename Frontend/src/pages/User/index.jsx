import { Fragment } from "react"
import Header from "../../components/Header"
import { UserProfile } from "../../components/UserProfile"
import { UserAppointments } from "../UserDashBoard"
import Footer from "../../components/Footer"

export const User=()=>{
    return(
        <Fragment>
        
         <UserProfile/>
         <UserAppointments/> 
       
        </Fragment>
    )
}