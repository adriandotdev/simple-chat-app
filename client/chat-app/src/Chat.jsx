/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import './App.css'

function Chat({ socket, username, room }) {

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    useEffect(() => {

        if (socket === null) return;

        socket.on("receive", (data) => {
            console.log(data);
            setMessageList([...messageList, data])
        });

        return () => {
            // socket.close();
        }
    }, [socket]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room,
                username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }


            await socket.emit("send_message", messageData);
            setMessageList([...messageList, messageData]);
        }
    }

    return (
        <div className='chat-window'>
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                <div className='message-container'>
                    {
                        messageList.map((message, index) => {
                            return (
                                <div key={index} className="message" id={username === message.username ? "you" : "other"}>
                                    <div>
                                        <div className="message-content">
                                            <p>{message.message}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="chat-footer">

                <input type="text" name="" id="input" placeholder='Hey...' onChange={(e) => setCurrentMessage(e.target.value)} />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )
}

export default Chat