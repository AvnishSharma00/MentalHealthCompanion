import { Fragment } from "react"
import { Header } from "../../components/Header"
import Footer from "../../components/Footer"
import { Sidebar } from "../../components/SideBar"

export const TherapistDashBoard = () => {
  return (
    <div className="flex flex-col min-h-screen">
  
      
      <main className="flex-grow flex">
        <Sidebar />
        {/* Add your dashboard content here */}
      </main>

    
    </div>
  )
}
