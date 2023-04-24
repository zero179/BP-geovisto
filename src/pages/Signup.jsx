import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import SignUpForm from '../components/SignUp/SignUpForm'
import "./signupElements.css"
import Foot from '../components/Footer/Footer'

const Signup = () => {
  return (
    <>
    <Navbar />
    <div class="header"><h1 >Sign Up, Please </h1></div>
    <SignUpForm/>
    <Foot/>
    </>
  )
}

export default Signup