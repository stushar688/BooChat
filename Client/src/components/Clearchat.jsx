import React, { useState } from 'react';
import { RiChatDeleteFill } from "react-icons/ri";
import styled from 'styled-components';
import axios from 'axios';
import { clearallchats } from '../utils/APIRoutes';

export default function Clearchat({currentchat, currentuser,msgdata}) {

  const[msg,setmsg]=useState();
    const handleClearchat=async()=>{
      await axios.post(clearallchats,{
        from:currentuser._id,
        to:currentchat._id
      }).then(res=>setmsg(res.data)).catch(err=>console.log(err))
    }
  return (
    <Button onClick={handleClearchat}> 
      <RiChatDeleteFill/>
    </Button>
  )
}

const Button=styled.button`
display:flex;
background:#4f4f52;
border:none;
font-size:1.1rem;
border-radius:5rem;
padding:0.3rem 0.4rem;
padding-bottom:0.5rem;
color:white;
&:hover{
  cursor:pointer;
}
`;
