import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { chatState } from "../../context/ChatProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading,setLoading]=useState(false)

  const {ENDPOINT}=chatState()

  const navigate=useNavigate();

  const handleShow = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async () => {
    setLoading(true);
    if ( !email || !password) {
      toast("Enter all the details");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${ENDPOINT}/api/user/login`,
        { email, password },
        config
      );
      toast("Success");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast("Error");
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <div>
      <form action="#">
        <div>
          <label htmlFor="email">Email Address: </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter the email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">password: </label>
          <div className="pass">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter the password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span onClick={handleShow}>{showPassword ? "hide" : "show"}</span>
          </div>
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <>
            <button id="login-btn" onClick={submitHandler}>
              Login
            </button>
          </>
        )}

      </form>
    </div>
  );
};

export default Login;
