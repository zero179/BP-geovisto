import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import LoginForm from '../components/Login/LoginForm'
import "./loginElements.css"
import Foot from '../components/Footer/Footer'


const Login = () => {
  return (
    <>
    <Navbar />
    <div class="header"><h1 >Log In, Please </h1></div>
    <LoginForm/>
    <Foot/>
    </>
  )
}

export default Login