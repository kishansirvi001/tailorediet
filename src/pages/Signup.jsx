import React, { useState } from "react";
import "./auth.css";

function Signup(){

const [formData,setFormData]=useState({
name:"",
email:"",
password:"",
dob:"",
gender:"",
height:"",
weight:""
});

const handleChange=(e)=>{
setFormData({...formData,[e.target.name]:e.target.value});
};

const handleSignup=async(e)=>{
e.preventDefault();

const res=await fetch("http://localhost:5000/api/auth/signup",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify(formData)
});

const data=await res.json();
alert(data.message);
};

return(

<div className="auth-wrapper">

<div className="auth-left">
<h1>TailorDiet</h1>
<p>Personalized nutrition for your body</p>
</div>

<div className="auth-right">

<h2>Create Account</h2>

<form onSubmit={handleSignup}>

<div className="form-group">
<label>Name</label>
<input type="text" name="name" onChange={handleChange} required/>
</div>

<div className="form-group">
<label>Email</label>
<input type="email" name="email" onChange={handleChange} required/>
</div>

<div className="form-group">
<label>Password</label>
<input type="password" name="password" onChange={handleChange} required/>
</div>

<div className="form-group">
<label>Date of Birth</label>
<input type="date" name="dob" onChange={handleChange}/>
</div>

<div className="form-group">
<label>Gender</label>
<select name="gender" onChange={handleChange}>
<option value="">Select</option>
<option value="male">Male</option>
<option value="female">Female</option>
</select>
</div>

<button className="auth-btn">Signup</button>

</form>

<p className="switch-text">
Already have account? <a href="/login">Login</a>
</p>

</div>
</div>

);

}

export default Signup;