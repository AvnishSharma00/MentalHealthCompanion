import { Fragment, useState } from "react";
import { logout } from "../../Api/loginapi";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../context/login-context";

export const Logout = () => {
  const { loginDispatch } = useLogin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // new state

  const logoutclick = async () => {
    setLoading(true); // start loading
    try {
      await logout();
      loginDispatch({ type: "LOG_OUT" });
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("Logout failed.");
      setLoading(false); // stop loading on error
    }
  };

  return (
    <Fragment>
      <div>
        <button
          onClick={logoutclick}
          disabled={loading} // disable button while logging out
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-full transition disabled:opacity-50"
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </Fragment>
  );
};
