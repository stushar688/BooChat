import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import axios from 'axios';
import { alluserroutes, addusers ,dltcontact} from '../utils/APIRoutes';
import { auth } from '../firebase';
import { MdPersonSearch, MdDelete } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";


export default function Contacts({ contacts, setcontacts, changechat, setisloaded }) {

    const [currentuser, setcurrentuser] = useState([]);
    const [searchcontact, setsearchcontact] = useState([]);
    const [currentselected, setcurrentselected] = useState([]);
    const [i, seti] = useState("");
    const [errmsg, seterrmsg] = useState([]);
    const [otheruser, setotheruser] = useState([]);
    const [notiflag, setnotiflag] = useState(false);



    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setcurrentuser(user);
            } else setcurrentuser("")

        })
    }, [])
    // useEffect(() => {
    //     if (currentuser) {
    //         setcurrentusername(currentuser.displayName)
    //     }
    // }, [currentuser]);

    function showerrmsg() {
        seterrmsg("")
    }

    // useEffect(()=>{
    //     setcurrentselected(0)
    // },[ch])

    const changecurrentchat = (index, contact) => {
        setcurrentselected(index);
        seti(index)
        changechat(contact);
        setotheruser(contact)
    }

    const findContact = async (e) => {
        e.preventDefault();
        if (searchcontact == currentuser.displayName) seterrmsg("current user cannot be added")
        else (await axios.post(alluserroutes, { searchcontact })
            .then(res => {
                // console.log(res.data.username)
                if (res.data == null) seterrmsg(`no user found named ${searchcontact}`);
                else {
                    axios.post(addusers, { currentuser: currentuser.displayName, contacttobeadded: res.data }).
                        then(res => {
                            if (res.data == "error") seterrmsg("user already added");
                            else seterrmsg(<p>user added</p>)
                            setisloaded(true)
                            setcurrentselected(i + 1)
                        }).catch(err => console.log(err))
                }
            })
            .catch(err => console.log(err))
        )
        setsearchcontact('')
        setTimeout(showerrmsg, 2000);
        // return(setisloaded(true))
    }

    const handledltcontact=async()=>{
        await axios.post(dltcontact,{currentuser:currentuser.displayName,contacttobeadded:otheruser})
        .then(res=>setcontacts(res.data))
        .catch(err=>console.log(err))
        setisloaded(true)
    }



    // useEffect(async()=>{
    //     await axios.post(addusers,{currentuser.displayName},)
    // },[contactAdd])


    // useEffect(() => {
    //     async function fetchData() {

    //         await axios.post(addusers,{currentuser:currentuser.displayName,contacttobeadded:contactAdd.username}).
    //         then(res=>{console.log(res)})

    //     }
    //     fetchData()
    //   }, []);

    return (
        <>

            <Container>
                <div className="brand">
                    <h3><b>Boo</b>Chat</h3>
                </div>

                <div className='add'>
                    <form className='addcontact' onSubmit={(e) => findContact(e)}>
                        <input id='myInput' type="text" placeholder={'Search user'} value={searchcontact} onChange={(e) => setsearchcontact(e.target.value)} />
                        <button className='submit'>
                            <MdPersonSearch />
                        </button>
                    </form>
                    <div className="errbox">{errmsg}</div>
                </div>

                <div className="contacts">
                    {
                        contacts.map((contact, index) => {
                            return (
                                <div className={`contact ${index === currentselected ? "selected" : ""}`} key={index} onClick={() => { changecurrentchat(index, contact) }}>
                                    <div className="user">
                                        <div className="pfp">{contact.profilePic ? (<img src={contact.profilePic} alt="" />) : <FaCircleUser />}</div>

                                        <div className="username">
                                            <h3>{contact.username}</h3>
                                        </div>
                                    </div>
                                    {/* <div className="notificationicon">{notiflag?1:0}</div> */}

                                    <div className="dlt" onClick={handledltcontact}><MdDelete /></div>
                                </div>
                            )
                        })
                    }
                </div>

                {/* <div className="currentuser">
                    <div className="username">
                        <h2>{currentuser.displayName}</h2>
                    </div>
                    
                </div> */}

            </Container>



        </>
    )
}

const Container = styled.div`

display : grid;
grid-template-rows:10% 10% 78% 2%;
overflow:hidden;
background-color:white ;
border:solid 0.1rem #eff2f2;
.brand{
    display:flex;
    align-items:center;
    justify-content:center;
    color:#181818;
    font-size:1.2rem;
}
.brand h3{
    b{
        color:#42cdaf;
    }
    // text-transform:uppercase;
}
.add{
    display:flex;
    flex-direction:column;
    align-items:center;
    form{
        width:94%;
        height:60%;
        border:0.07rem solid #d9d9d9;
        border-radius:0.1rem;
        display:flex;
        flex-direction:row;
        input{
            height:94%;
            width:75%;
            padding-left:0.4rem;
            outline:none;
            border:none;
            background:transparent;
            &::placeholder {
                color: #a7a9a9;
                opacity:0.8;
              }
            input::focus{
                value:""
            }
        }
        button{
            width:25%;
            height:100%;
            border:none;
            background-color:#42cdaf;
            color:white;
    
            &:hover{
                cursor:pointer;
                background-color:#3bb99e;
                transition: 0.2s;
            }
            font-size:1.3rem;
            padding-top:0.3rem;
            padding-right:0.3rem;
            border-radius:0.1rem;

            &::select{
                background-color:pink;
            }
        }
    }
    .errbox{
        font-size:0.7rem;
        display:flex;
        padding:0.1rem;
        color:red;
        p{
            margin:0;
            color:#42cdaf;
        }
    }
}

.contacts{
    display:flex;
    padding-top:0.2rem;
    flex-direction:column;
    align-items:center;
    overflow:auto;
    gap:0.6rem;
    overflow-x:hidden;
    &::-webkit-scrollbar{
        width:0.2rem;
        &-thumb{
            background-color:#d7dada;
            width:0.1rem;
            border-radius:1rem;
        }
    }
    .contact{
        background-color:#f9fafa;
        height:4rem;
        width:90%;
        cursor:pointer;
        padding: 0.4rem;
        border-radius:0.3rem;
        gap: 0.6rem;
        align-items:center;
        display:flex;
        justify-content: space-between;
        // transition:0.2s ease-in-out;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.19);
         
        &:hover{
            background: rgba(0, 0, 0, 0.04);
            .dlt{
                color:grey;
            }
        }
        .user{
            display:flex;
            align-items:center;
            gap:0.6rem;
            flex-direction:row;
            width:70%;
        }
        .username {
            width:80%;
            overflow:hidden;
            h3{
                padding:1rem 0rem;
                margin:0px;
                color:#303030;
                
            }}

        &:active{
            background:rgba(0, 0, 0, 0.09);
          }

        .pfp{
            display:flex;
            background-color:white;
            border-radius:50%;
            overflow:hidden;
            height:3rem;
            min-width:3rem;
            width:3rem;
            align-items:center;
            justify-content:center;
            position:relative;
            // object-fit: cover;
            
            
            svg{
                font-size:3rem;
                color:#d9d9d9
            }
        
            img{
              display: inline;
              margin: 0 auto;
              object-fit: cover;
              min-width:100%;
              min-height:100%;
              width: auto;
            }
        }
        .dlt{
            display:none;
            float:right;
            color:#f9fafa;
            font-size:1.3rem;
            // width:15%;
            justify-content:right;
            align-items:center;
            &:hover{
                color:#303030;
            }
            svg{
                
            }

        }
    }

    .selected{
        background: #232327;
        &:hover{
            background: #232327;
            .dlt{
                color:white;
            }
        }
        .username h3{
            color:#eff2f2;
        }
        .dlt{
            display:flex;
        }
        .dlt:hover{
            color:grey;
        }
        
        transition:0.1s;
    }
}
.currentuser{
    background-color:white;
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:1rem;
    gap:1rem;

    .username h2{
        color:black;
    }
    .logout{

    }
}
@media screen and (max-width: 700) {
      
    
`;
