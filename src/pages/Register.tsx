import { useEffect } from "react";
import { useNavigate } from "react-router";
import Login from "./Login";

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login with register mode via navigation state
    navigate("/login", { state: { mode: "register" } });
  }, [navigate]);

  return <Login />;
}
