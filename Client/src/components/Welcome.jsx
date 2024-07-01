import React ,{useEffect, useState} from 'react';
import styled from 'styled-components';
import { auth } from '../firebase';
import booimage from './boochatlogo.png'

export default function Welcome() {
  const [currentusername,setcurrentusername]=useState([]);

  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      if(user){
        setcurrentusername(user);
      }else setcurrentusername("")
    })
  },[])
//   useEffect(()=>{
// setcurrentusername(currentuser.displayName)
//   },[currentusername])
  
  return (
    <>{
      <Container>
        <img src={booimage} alt="na" width={150}/>
      <h1>
        Welcome, <span className='username'>{currentusername.displayName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
    }
    </>
  )
}

const Container = styled.div`
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
  h1{
    color:#3232327;
  }
  .username{
    color:#42cdaf;
  }
  h3{
  margin:0;
  font-size:16px;
    color:#232327;
  }
`;
