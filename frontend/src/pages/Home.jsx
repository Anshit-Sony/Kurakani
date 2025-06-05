import { useEffect, useState } from 'react'
import './home.css'
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

const Home = () => {
  const [loginSignup,setLoginSignup]=useState(true);
  const navigate=useNavigate()

  useEffect(()=>{
    const userInfo=JSON.parse(localStorage.getItem("userInfo"));

    if(userInfo){
      navigate('/chats')
    }
  })

  return (
    <div className="outer">
      <div className="container">
        <div className="heading">Kurakani App</div>

        <div className="main">
          <div className="switch">
            <span onClick={() => setLoginSignup(true)}>Login</span>
            <span onClick={() => setLoginSignup(false)}>Signup</span>
          </div>
          {loginSignup ? <Login /> : <Signup />}
        </div>
      </div>
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
      />
    </div>
  );
}

export default Home
