import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showcurrentuser, host, showaddeduser } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import Chatcontainer from '../components/Chatcontainer';
import { io } from "socket.io-client";
import { auth } from '../firebase';
import { FaUserLarge } from "react-icons/fa6";
import Logout from '../components/Logout';
import { reload } from 'firebase/auth';
import { addpfp, addpfptodb } from '../utils/APIRoutes'
import { IoCloseSharp } from "react-icons/io5";

export default function Chat({ curr }) {
  // const location=useLocation()
  // console.log(curr)
  // console.log(data)
  // console.log(currusers)
  const navigate = useNavigate();
  const socket = useRef();

  const [contacts, setcontacts] = useState([]);
  const [currentuser, setcurrentuser] = useState("");
  const [currentchat, setcurrentchat] = useState("");
  const [isloaded, setisloaded] = useState(false);
  const [curruser, setcurruser] = useState("");
  const [inlargeprofile, setinlargeprofile] = useState(false);
  const [profilepic, setprofilepic] = useState([]);

  const uploadref = useRef(null)

  useEffect(() => {

    auth.onAuthStateChanged((user) => {
      if (user) {
        setcurrentuser(user);
        setisloaded(true)
      } else setcurrentuser("")
    })
  }, [])

  useEffect(() => {
    if (currentuser === "" ) {
      navigate("/Login")
    }
  },[curruser])

  useEffect(() => {
    if (curr != "") {
      setcurruser(curr)
    }
  }, [])

  useEffect(() => {
    async function fetchdata() {
      if (curruser) {
        socket.current = io(host)
        socket.current.emit("add-user", curruser._id);
        console.log(`${curruser.username} connected`)
        //   if (count==0 && currentuser.displayName) {
        //     await axios.post(showaddeduser,{currentuser:currentuser.displayName}).
        //      then(res=>{
        //        console.log(res.data.addedContacts)
        //        setcontacts(res.data.addedContacts)
        //       //  setcount(1)
        //      })
        //    }
      }
    }
    fetchdata()
  }, [curruser]);

  useEffect(() => {
    async function fetchData() {
      if (isloaded && currentuser.displayName) {
        await axios.post(showaddeduser, { currentuser: currentuser.displayName }).
          then(res => {
            // console.log(res.data)
            setcontacts(res.data.addedContacts)
            handlechatchange = (chat) => {
              setcurrentchat(chat)
            }
          }).catch((err)=>console.log(err))
        }
        setisloaded(false);
    }
    fetchData()
  });
// console.log(contacts)
  let handlechatchange = (chat) => {
    setcurrentchat(chat)
  }

  const uploadimage=(e)=>{
    const file=e.target.files[0];
    const data = new FormData();
    data.append("file",file);
    data.append("upload_preset", "chatApp")
    data.append("cloud_name", "ewebsite");
    fetch(`https://api.cloudinary.com/v1_1/ewebsite/image/upload`, {
        method: "post",
        body: data
    })
    .then((res=>res.json()))
    .then(async(data)=>{
      await axios.post(addpfptodb, {
        username: curruser,
        profilePic: data.secure_url
      }).then(res => console.log(res)).catch(err => console.log(err))
    })
  }
  // useEffect(() => {
  //   async function fd() {
  //     if (profilepic != "") {
  //       const formData = new FormData();
  //       formData.append("image", profilepic)

  //       await axios.post(addpfp, formData)
  //         .then(async (res) => {
  //           console.log(res.data);
  //           await axios.post(addpfptodb, {
  //             username: curruser,
  //             profilePic: res.data
  //           }).then(res => console.log(res)).catch(err => console.log(err))
  //         })

  //         .catch(err => console.log(err));
  //     }
  //     setprofilepic("")
  //   }
  //   fd()
  // }, [profilepic])

  
  const handleimage = (e) => {
    // console.log(e.target.files[0]);
    // setprofilepic(e.target.files[0])
    uploadref.current.click()
  }
  useEffect(() => {
    if (currentuser.displayName && !curruser) {
      async function fetchdata() {
        await axios.post(showcurrentuser, { currentuser: currentuser.displayName }).
          then(res => {
            setcurruser(res.data)
          })
      }
      fetchdata()

    }
  }, [currentuser.displayName])
// console.log(currentuser.profilePic)
  return (
    <>
      {
        currentuser && curruser && (
          <>
            <Container>
              <div className='container'>
                <div className={`left ${inlargeprofile === true ? "on" : "off"}`}>
                  <div className="nav">
                  {inlargeprofile && <div className='back' onClick={()=>setinlargeprofile(!inlargeprofile)}><IoCloseSharp /></div>}
                    <div className={`profileimage ${inlargeprofile === true ? "profileimageon" : "profileimageoff"}`}
                      onClick={() => setinlargeprofile(!inlargeprofile)}>{curruser.profilePic ?
                        (<div className="croper">
                          <img src={curruser.profilePic} alt="" />
                        </div>
                        ): <FaUserLarge />}
                        

                    </div>
                    {

                      inlargeprofile &&
                      (
                      <>
                      
                        <div className="profile">

                          <div className="user">

                            <div className="username">
                              <h1>{curruser.username}</h1>
                            </div>

                            <button className='updatepfp' onClick={handleimage}>update profile pic</button>

                            <input type="file" ref={uploadref} accept='image/*' onChange={uploadimage} />

                            <div className="detail">
                              email : <span>{curruser.email}</span>
                            </div>
                          </div>

                          <div className='logout'><p>logout</p><Logout /></div>
                        </div>
                    </>
                      )
                    }
                  </div>
                  <Contacts contacts={contacts} currentuser={currentuser} changechat={handlechatchange} setcontacts={setcontacts} setisloaded={setisloaded} />
                </div>
                {
                  (!currentchat) ?
                    (<Welcome currentuser={currentuser} />)
                    :
                    (<Chatcontainer currentchat={currentchat} currentuser={curruser} socket={socket} />)
                }

              </div>
            </Container>
          </>
        )}
    </>
  )
}

const Container = styled.div`

background-color:#ffffff;
height:100vh;
width:100vw;
display:flex;
flex-direction:colummn;
justify-content:center;
align-items:center;

.container{
  height:85vh;
  width:85vw;
  background-color:#fdfefe;
  display:grid;
  grid-template-columns: 25% 75%;
  grid-template-rows:100%;
  box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 1), 0 1px 30px 0 rgba(0, 0, 0, 0.19);
  
  .left {
    display:grid;
    grid-template-columns:15% 85%;
    
    .nav{
     background-color:#232327;
     height:100%;
     width:100%;
     color:white;
     display:flex;
     flex-direction:column;
     justify-content:space-between;
     position:static;

    // .profileimage{
    //   height:100%;
    //   width:100%;
    //   display:flex;
    //   align-items:center;
    //   justify-content:center;
    // }
     .profileimageoff{

       transition:1s;
      // position:relative;
      display:flex;
      align-items:center;
      justify-content:center;
      height:3rem;
      width:100%;
      // padding:0.5rem;
      // padding-top:0.7rem;
    
       &:hover{
         cursor:pointer;
       }
       .croper{
        display:flex;

        border-radius:50%;
        overflow:hidden;
        height:1.5rem;
        width:1.5rem;
        // position:relative;
        transition:1s;
        img{
         // border-radius:50%;
         display: inline;
         margin: 0 auto;
         object-fit: cover;
         height:100%;
         width: 100%;
        //  transition:1s;
       }
      }
    }
    .back{
      display:flex;
      justify-content:flex-end;
      align-items;center;
      padding-top:10px;
      padding-right:14px;
      font-size:1.5rem;
      height:5%;
      transition:1s;
      position:relative;
    }
     .profileimageon{
      position:relative;
      // border-radius:50%;
      display:flex;
      overflow:hidden;
      align-items:center;
      justify-content:center;
      height:30%;
      width:100%;
      // padding-top:2rem;
      font-size:4rem;
      transition:1s;
       &:hover{
         cursor:pointer;
       }
       
       .croper{
        display:flex;
        transition:1s;
        border-radius:50%;
        overflow:hidden;
        height:8rem;
        width:8rem;
        position:relative;
        img{
         // border-radius:50%;
         display: inline;
         margin: 0 auto;
         object-fit: cover;
    
         height:100%;
         width: 100%;
       }
      }
      
    }
      .profile{
        height:70%;
        width:100%;
        display:flex;
        justify-content:space-between;
        flex-direction:column;
        align-items:center;

        .user{
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          width:100%;
          
          .username{
            display:flex;
            // padding-top:1rem;
            // height:4.5rem;
            // align-items:center;
            // justify-content:center;
            max-width:100%;
            h1{
              margin:0;
              color:#42cdaf;
            }
            
            // animation:show 1s ;
            // transition-delay:2s;
            // animation-delay:1s;
            // @keyframes show{
            //   from {right:20px; top:0; }
            //   to {right:0; top:0 ;}
            // }
  
          }
          .detail{
            max-width:90%;
            // overflow-wrap:break-word;
            span{
              color:#42cdaf;
            }
          }
          input{
            display:none;
          }
          gap:1rem;
          button{
            max-width:90%;
            border:none;
            background-color:#303030;
            color:white;
            padding:0.3rem 0.7rem;
            &:hover{
              cursor:pointer;
              background-color:#141414
              // transform:translateY(-0.5px);
              // box-shadow: 0px 1px 1.5px 0px black;
            }

          }
        }
        

        .logout{
          position:relative;
          display:flex;
          aligh-items:center;
          justify-content:center;
          gap:0.4rem;
          padding:1rem;
          animation:logoutshow 1s;
          @keyframes logoutshow{
            from {left:0; top:15px; font-size:0px}
            to {left:0; top:0 ; font-size:1rem}
          }
          p{
            margin:0;
            padding-top:0.2rem;
          }
        }
      }
    }

    
  }
  .on{
    grid-template-columns:100% 0%;
    transition:1s ;
  }
  .off{
    transition:1s ;
  }
  
}


@media screen and (max-width: 700px) {
  
  .container{
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    height:100%;
    width:100%;
    grid-template-columns:100%;
    grid-template-rows:100% 100%;

   }
}
`
