import { Routes, Route, Outlet } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Homepage from "./pages/Home";
import LoginPage from "./pages/LoginPage/index.jsx";
import CreateJournal from "./components/CreateJournal/index.jsx";
import { Therapist } from "./pages/Therapist";
import { Admin } from "./pages/Admin/index.jsx";
import { UserSignup } from "./pages/SignUpPage/index.jsx";
import { TherapistDashBoard } from "./pages/TherapistDashboard/index.jsx";
import { TherapistSignUp } from "./pages/TherapistSignUp/index.jsx";
import { TherapistDetails } from "./components/TherapistDetail";
import { User } from "./pages/User/index.jsx";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Privateroute } from "./components/PrivateRoute/index.jsx";

// Layout wrapper
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Layout wraps all pages */}
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={ <Privateroute allowedRole={"USER"}><Homepage /></Privateroute>} />
        <Route path="/journal" element={<Privateroute allowedRole={"USER"}><CreateJournal /></Privateroute>} />
        <Route path="/therapistdata" element={<Privateroute><Therapist /></Privateroute>} />
        <Route path="/admin" element={<Privateroute allowedRole={"ADMIN"}><Admin /></Privateroute>} />
        <Route path="/userSignUp" element={<UserSignup />} />
        <Route path="/therapistdashboard" element={ <Privateroute  allowedRole="THERAPIST">
        <TherapistDashBoard /> </Privateroute>    } />
        <Route path="/therapists/:id" element={<Privateroute><TherapistDetails /></Privateroute>} />
        <Route path="/therapistsignup" element={<TherapistSignUp />} />
        <Route path="/profile" element={<Privateroute><User /></Privateroute>} />
      </Route>
    </Routes>
  );    
}

export default App;
