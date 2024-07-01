import { useEffect, useState } from "react";
import React from 'react';
import axios from "axios";
import { loginroute, registerRoute } from "../utils/APIRoutes";
import { Link,useNavigate } from "react-router-dom";
import styled from "styled-components";
import {  signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login({setcurr}) {

    const[errorMsg,setErrorMsg]=useState();
    const [sent, setsent] = useState(false);
    let navigate = useNavigate();

    useEffect(()=>{
        auth.onAuthStateChanged((user)=>{
        //   console.log(user);
          if(user){
            navigate("/")
          }
        })
      },[])
    

    const [values,setValues]=useState({
        email:"",
        password:"",
    })
    const handlechange=(e)=>{
        setValues({...values,[e.target.name]:e.target.value})
    }
    
    const handlesubmit=async(e)=>{
        e.preventDefault();
        const{email,password}=values;
        setsent(true)

        signInWithEmailAndPassword(auth,email,password)
        .then(async(res)=>{
            // console.log(res);
                 navigate('/')
            
        }).catch((err)=>{
            setsent(false)
            setErrorMsg(err.message);
        })
        

            // if(handleValidation()){
            // const{data}=await axios.post(loginroute,{
            //     username,
            //     password
            // });
            
            // if(data.status===false){
            //     setErrorMsg(data.msg)
            // }
            // if(data.status===true){
            //     localStorage.setItem("chat-app-user",JSON.stringify(data.User));
            //     navigate("/"); 
            // }
            //   } 
    }

    // const handleValidation=()=>{
    //     const{password,username}=values;
    //      if(username===""){
    //         setErrorMsg("please fill Username");
    //         return false;
    //     }
    //     else if (password===""){
    //         setErrorMsg("please fill password")
    //         return false;
    //     }
    //     return true;
    // }

    return (

        <>
            <Container>
                <form onSubmit={(e) => handlesubmit(e)}>
                        <input
                            type="text"
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
                        <span className="err">{errorMsg}</span>
                        <button type="submit" disabled={sent ? true : false}>Login</button>
                        <span>Don't have an account? <Link to="/register">register</Link></span>

                </form>
            </Container>
        </>

    )
}

const Container=styled.div`
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
        max-width:12rem;
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
    .err{
        color:red;
        font-size:0.8rem;
    }
    span{
        display:flex;
        gap:0.5rem;
        justify-content:center;
        align-items:center;
        color:white;
        padding:0 1.2rem;
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


