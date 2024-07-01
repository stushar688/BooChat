import { useEffect, useState } from "react";
import styled from "styled-components";
import React from 'react';
import axios from "axios";
import { registerRoute, showcurrentuser } from "../utils/APIRoutes";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";


export default function Register({ setcurr }) {

    const [errorMsg, setErrorMsg] = useState();
    const [currentuser, setcurrentuser] = useState("");
    const [curruser, setcurruser] = useState("");
    const [isloaded, setisloaded] = useState(false);
    const [sent, setsent] = useState(false);

    let navigate = useNavigate();

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        cfpassword: ""
    })
    const handlechange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const handlesubmit = async (e) => {
        e.preventDefault();
        const { password, username, email, cfpassword } = values;
        if (!username || !email || !password || !cfpassword) { setErrorMsg("please fill all fields"); return }
        else if (password.length < 6) { setErrorMsg("password must contain atleast 6 characters"); return }
        else if (password != cfpassword) { setErrorMsg("confirm password and password must be same"); return }
        else {

            setsent(true)
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (res) => {
                    const user = res.user;
                    await updateProfile(user, {
                        displayName: username
                    });
                    setcurrentuser(user)
                    setisloaded(true)
                    // console.log(res.user);


                    await axios.post(registerRoute, {
                        username,
                        email,
                        password
                    }).then(res => {
                        if (res.data.status == false) { setErrorMsg("username already exist, try different");setsent(false); return }
                        else {
                            setcurr(res.data.User)
                            navigate('/')
                        }
                    })
                        .catch(err => console.log(err));
                })
                .catch((err) => {
                    console.log(err.message);
                    setErrorMsg(err.message);
                    setsent(false)
                })

        }

    }
    // useEffect(() => {
    //     if (currentuser.displayName) {
    //       async function fetchdata() {
    //         await axios.post(showcurrentuser, { currentuser: currentuser.displayName }).
    //           then(res => {
    //             setcurruser(res.data)
    //           })
    //       }
    //       fetchdata()
    //     }
    //   }, [currentuser.displayName])

    return (

        <>
            <Container>

                <form onSubmit={(e) => handlesubmit(e)}>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={(e) => handlechange(e)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={(e) => handlechange(e)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={(e) => handlechange(e)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="cfpassword"
                        onChange={(e) => handlechange(e)}
                    />
                    <span className="err">{errorMsg}</span>
                    <button type="submit" disabled={sent ? true : false}>Create User</button>
                    <span>Already have an account? <Link to="/login">Login</Link></span>
                </form>

            </Container>
        </>

    )
}
const Container = styled.div`
margin:0;
background-color:#ffffff;
height:100vh;
width:100vw;
display:flex;
align-items:center;
justify-content:center;
form{
    display:flex;
    align-items:center;
    justify-content:center;
    background-color:#42cdaf;
    padding:2.5rem 1rem;
    max-width:17rem;
    width:17rem;
    flex-direction:column;
    border-radius:2rem;
    gap:1rem;
    box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 1), 0 0px 70px 0 rgba(0, 0, 0, 0.2);

    input{
        padding:1rem;
        background-color:;
        width:60%;
        max-width:60%;
        outline:none;
        border:none;
        border-radius:0.6rem;
        &::placeholder {
            color: #a7a9a9;
            opacity:0.8;
          }
        &::selection{
            
        }
    }
    .err{
        font-size:0.8rem;
        color:red;
    }
    button{
        background-color:#68d7bf;
        font-size:1rem;
        box-shadow:0px 0px 5px 0px #3bb99e;
        border:none;
        width:7rem;
        height:2.5rem;
        border-radius:0.5rem;
        color:white;
        &:hover{
            cursor:pointer;
            box-shadow:0px 0px 7px 0px #3bb99e;
        }
        &:disabled{
            background-color:#35a48c;
        }
        &:active{
            background-color:#35a48c;
        }
    }
    span{
        display:flex;
        gap:0.5rem;
        justify-content:center;
        align-items:center;
        color:white;
        padding:0 1.2rem;
        max-width:90%;
    }
}

@media screen and (max-width: 700px) {
  
    justify-content:center;
    align-items:center;
    form{
        display:flex;
      height:100vh;
      width:100vw;
      max-width:100%;
    
     }
  }
`
