import React, { useState } from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login"
import Chat from "./pages/Chat"
import Contacts from './components/Contacts';

export default function App() {

  const [currentuser,setcurrentuser]=useState("");
 
  return (
    <BrowserRouter>
       <Routes>
        <Route path="/" element={<Chat curr={currentuser} />}/>
        <Route path="/register" element={<Register setcurr={setcurrentuser}/>}/>
        <Route path="/login" element={<Login setcurr={setcurrentuser}/>}/>
        <Route path="/contacts" element={<Contacts/>}/>
        
       </Routes>
       </BrowserRouter>
  ) 
}

