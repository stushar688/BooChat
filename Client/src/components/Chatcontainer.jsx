import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import Clearchat from './Clearchat';
import Chatinput from './Chatinput';
import { RiChatDeleteFill } from "react-icons/ri";
import { FaCircleUser } from 'react-icons/fa6';
import Messages from './Messages';
import axios from 'axios';
import { getallmessageroute, sendmsgroute, clearallchats, addimage } from '../utils/APIRoutes';
// import { getallmessageroute, sendmsgroute, clearallchats, addimage } from '../../public';
import { v4 as uuidv4 } from 'uuid';
// const images = require("../uploadedImage/17056480260421.png")

export default function Chatcontainer({ currentchat, currentuser, socket}) {
    
    const [messages, setmessages] = useState([]);
    const [arrivalmsg, setarrivalmsg] = useState([]);
    const [msgs, setmsg] = useState();
    const [isloaded, setisloaded] = useState(false);
    const [imagee, setimage] = useState("");
    const [img, setimg] = useState("");
    
    
    var reader = new FileReader();
    const scrollRef = useRef(null);
    
    // console.log(imagee)
    let newdata;
    let msgdata;
    useEffect(() => {
        async function fetchdata() {
            if (currentchat) {
                await axios.post(getallmessageroute, {
                    from: currentuser._id,
                    to: currentchat._id
                }).then(res => msgdata = res.data).catch(err => console.log(err));
                setmessages(msgdata)
            }
        }
        fetchdata();
    }, [currentchat])



    const handlesendmsg = async (msg) => {
        // if (image.name && msg=="") {

        //     const formData = new FormData();
        //     formData.append("image", image)


        //     await axios.post(addimage, formData)
        //         .then(async (res) => {
        //             setimage(res.data);
        //             socket.current.emit('send-msg', {
        //                 to: currentchat._id,
        //                 from: currentuser._id,
        //                 message: "null",
        //                 image: res.data
        //             })
        //             await axios.post(sendmsgroute, {
        //                 from: currentuser._id,
        //                 to: currentchat._id,
        //                 message: "null",
        //                 image: res.data
        //             })
        //             const msgs = [...messages];
        //             msgs.push({ fromself: true, message: null, image: res.data });
        //             setmessages(msgs);
        //             setisloaded(true)
        //         })
        //         .catch(err => console.log(err));

        

            // reader.readAsDataURL(image);
            // reader.onload = async() => {

            //     setimage(reader.result)
            //     const msgs = [...messages];
            //     msgs.push({ fromself: true, message: msg, image: reader.result });
            //     setmessages(msgs);

            //     socket.current.emit('send-msg', {
            //         to: currentchat._id,
            //         from: currentuser._id,
            //         message: msg,
            //         image: reader.result
            //     })
            //     await axios.post(sendmsgroute, {
            //         from: currentuser._id,
            //         to: currentchat._id,
            //         message: null,
            //         image: reader.result
            //     })
            // }

            // console.log(imagee)


        if (msg) {
            await axios.post(sendmsgroute, {
                from: currentuser._id,
                to: currentchat._id,
                message: msg,
                image: "null"
            })
            socket.current.emit('send-msg', {
                to: currentchat._id,
                from: currentuser._id,
                message: msg,
                image: "null"
            })

            const msgs = [...messages];
            msgs.push({ fromself: true, message: msg, image: "null" });
            setmessages(msgs);
        }
    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-recieve', (data) => {
                setarrivalmsg({ fromself: false, message: data.message, image: data.image })

            })
        }
    })

    // const handleimagepost = async ({ image }) => {

    //     const formData = new FormData();
    //     formData.append("image", image)

    //     console.log(formData)

    //     await axios.post(addimage, formData)
    //         .then(res => setimage(res.data))
    //         .catch(err => console.log(err));


    // }

    const handleClearchat = async () => {
        await axios.post(clearallchats, {
            from: currentuser._id,
            to: currentchat._id
        }).then(res => setmsg(res.data)).catch(err => console.log(err))

        // const msg = [...messages];
        // msg.push({ fromself: true, message: "deleted!" });
        setmessages([{ fromself: true, message: "All chats deleted!", image: null }]);

        socket.current.emit('send-msg', {
            to: currentchat._id,
            from: currentuser._id,
            message: "deleted!"
        })

    }
    useEffect(() => {
        let arrivalmsgs = arrivalmsg;
        if (arrivalmsgs.message == "deleted!") {
            setmessages([{ fromself: false, message: `All chat deleted by ${currentchat.username}` }])
        }
        else setmessages((prev) => [...prev, arrivalmsgs])
    }, [arrivalmsg]);


    // useEffect(()=>{
    //     if(isloaded)
    //     {const {ig} =require(`./17056532572121.png`).default
    //     setimg(ig)}
    //    console.log(img);
    // setisloaded(false)
    // },[isloaded,imagee])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages]);
    return (
        <>
            {
                currentchat && (
                    <Container>
                        <div className="chatheader">
                        
                            <div className="userdetail">
                                <div className="pfp">{currentchat.profilePic?(<img src={currentchat.profilePic} alt="no" />):<FaCircleUser />}</div>
                                <div className="username">
                                    
                                    <h3>{currentchat.username}</h3>
                                    
                                </div>
                            </div>

                            <button onClick={handleClearchat} >
                                <RiChatDeleteFill />
                            </button>

                        </div>
                        <div className="chat-messages">
                            {
                                messages.map((message) => {

                                    return (

                                        <div ref={scrollRef} key={uuidv4()} className={`message ${message.fromself ? "sended" : "recieved"}`}>
                                            <div className="content">
                                                <p>
                                                    {message.message}
                                                    
                                                </p>
                                            </div>
                                            

                                        </div>
                                    )
                                })
                            }
                            
                        </div>
                        <Chatinput handlesendmsg={handlesendmsg}  />
                    </Container>
                )
            }
        </>
    )
}

const Container = styled.div`

display:grid;
grid-template-rows:10% 78% 12%;
flex-direction:column;
overflow:hidden;

.chatheader{
    
    display:flex;
    background-color:#232327;
    justify-content:space-between;
    align-items:center;
    padding:0 1.1rem;
    .userdetail{
        display:flex;
        align-items:center;
        justify-content: space-between; 
        gap:1rem;
         .username h3{
                color:white;
            }
        }
        .pfp{
            background-color:white;
            border-radius:50%;
            height:2.8rem;
            width:2.8rem;
            display:flex;
            align-items:center;
            justify-content:center;
            flex-direction:column;
            overflow:hidden;
            svg{
                font-size:2.8rem;
                color:#d9d9d9
            }
            
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
    button{
        display:flex;
        background:transparent;
        border:none;
        font-size:1.35rem;
        border-radius:5rem;
        padding:0.3rem 0.4rem;
        padding-bottom:0.5rem;
        color:white;
        &:hover{
          cursor:pointer;
        }
    }
}
.chat-messages{
    padding:1rem 2rem;
    display:flex;
    flex-direction:column;
    overflow:auto;
    
    gap:1rem;
    &::-webkit-scrollbar{
        display:none;
    }
    
    .message {
        display:flex;
        align-items:center;
        // animation: pop 0.3s linear 1;
        // @keyframes pop{
        //     50%  {transform: scale(1.2);}
        //   }
        .content {
            box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
            border-radius:2rem 2rem 2rem 0rem;
            font-size:1rem;
            padding:0 1.3rem;
            overflow-wrap:break-word;
            max-width:40%;
        }
        
    }
    .sended{
        justify-content:flex-end;
        
        .content{
            background-color:#42cdaf;
            color:white;
            max-width:40%;
            border-radius:2rem 2rem 0rem 2rem;
        }
    }
    recieved{
        justify-content:flex-start;
        background-color:#eff2f2;
        display:flex;
            color:#232327;
            width:40%;
            border-radius:1rem;
            font-size:1rem;
            overflow-wrap:break-word;
            
        
    }
}
@media screen and (max-width: 700px) {
    height:100%;
    width:100%;
}
`;
