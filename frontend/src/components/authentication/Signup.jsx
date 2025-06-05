import { useState } from "react";
import "./signup.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { chatState } from "../../context/ChatProvider";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {ENDPOINT}=chatState();

  const handleShow = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmShow = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const postDetails = async (pics) => {
    setLoading(true);

    if (!pics) {
      toast("Please select an image");
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const ImageData = new FormData();
      ImageData.append("file", pics);
      ImageData.append("upload_preset", "kurakani");
      ImageData.append("cloud_name", "daj7xokjl");

      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/daj7xokjl/image/upload",
        ImageData
      );

      if (data) {
        console.log(data);
        setPic(data.secure_url);
        setLoading(false);
      } else {
        toast(" Unable to Upload Image");
        setLoading(false);
      }
    } else {
      toast("Please select a JPEG or PNG image");
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast("Enter all the details");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast("Password and confirm password doesn't match");
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
        `${ENDPOINT}/api/user`,
        { name, email, password, pic },
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
    <form>
      <div>
        <label htmlFor="name">Full Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your full name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="email">Email Address:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <div className="pass">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={handleShow}>{showPassword ? "hide" : "show"}</span>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <div className="pass">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span onClick={handleConfirmShow}>
            {showConfirmPassword ? "hide" : "show"}
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="profilePicture">Upload Profile Picture:</label>
        <input
          type="file"
          id="profilePicture"
          name="profilePicture"
          accept="image/*"
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        />
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <button type="submit" onClick={submitHandler}>
          Sign Up
        </button>
      )}
    </form>
  );
};

export default Signup;
