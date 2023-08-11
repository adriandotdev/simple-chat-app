import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../contexts/ChatContext';
import ScrollToBottom from 'react-scroll-to-bottom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

function Chat() {

    const { messages, loggedInUser, currentUserInChat, socket, setMessages, setNotifications, setUsers, message, setMessage, idToUpdate, setIdToUpdate, isUpdating, setIsUpdating } = useContext(ChatContext)

    const submit = async (e) => {

        e.preventDefault();

        if (currentUserInChat?.username && message) {

            const id = uuidv4();

            const data = { loggedInUser, currentUserInChat, message: { id, message, username: loggedInUser.username, to: currentUserInChat.username } }
            await socket.emit('send_message', data);

            setMessages([...messages, { id, message, username: loggedInUser.username, to: currentUserInChat.username }]);

            setMessage('');
        }
    }

    const deleteMessage = async (e, id) => {

        e.preventDefault();

        const response = await axios.delete(`http://localhost:3001/api/v1/messages/${id}`);

        setMessages([...response.data]);

        socket.emit('delete_message', { currentUserInChat, loggedInUser });
    }

    const setupMessageToUpdate = async (e, id, message) => {

        e.preventDefault();

        setIsUpdating(true);
        setIdToUpdate(id);
        setMessage(message);
    }

    const updateMessage = async (e) => {

        e.preventDefault();

        if (message) {
            const response = await axios.put('http://localhost:3001/api/v1/messages', { id: idToUpdate, messageToUpdate: message })

            setMessages([...response.data]);
            setIsUpdating(false);
            setIdToUpdate('');
            setMessage('');
        }

        socket.emit('update_message', { currentUserInChat, loggedInUser });
    }

    useEffect(() => {

        socket.on("receive", (data) => {

            console.log(data)
            if (currentUserInChat?.username) {
                // console.log(data.messages);
                setMessages(data.messages);
                setUsers(data.registeredUsers);

            }
            setNotifications(data.notifications);
        });
    });

    return (
        <div className='col h-100 d-flex flex-column pb-3 p-0'>

            {
                currentUserInChat.username ? <>
                    <div id="contact-header" className='p-2 mb-3 fw-bold'>
                        <span className="d-block">{currentUserInChat.name}</span>
                    </div>
                    <ScrollToBottom className='scroll'>
                        <div className='body d-flex flex-column gap-3 pb-3 px-3 gap-3'>
                            {
                                messages.map((message) => {

                                    if (message.username === loggedInUser.username
                                        && message.to === currentUserInChat.username)
                                        return (
                                            <div className="d-flex align-items-center gap-1 align-self-end" key={message.id} >
                                                <div className="dropdown">
                                                    <button className="btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">

                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        <li onClick={(e) => deleteMessage(e, message.id)}><a className="dropdown-item" href="#">Delete</a></li>
                                                        <li onClick={(e) => setupMessageToUpdate(e, message.id, message.message)}><a className="dropdown-item" href="#">Update</a></li>
                                                    </ul>
                                                </div>
                                                <div style={{ maxWidth: '15rem', wordWrap: 'break-word' }} className='rounded py-2 you'>
                                                    <p className='my-auto px-2 text-left'>{message.message}</p>
                                                </div>
                                            </div>
                                        )
                                    else if (message.username === currentUserInChat.username && message.to === loggedInUser.username) {
                                        return (
                                            <div key={message.id} style={{ maxWidth: '15rem', wordWrap: 'break-word' }} className='other rounded py-2 align-self-start'>
                                                <p className='my-auto px-2 text-left'>{message.message}</p>
                                            </div>
                                        )
                                    }
                                })
                            }

                        </div>
                    </ScrollToBottom>
                    <form onSubmit={isUpdating ? updateMessage : submit} onKeyDown={isUpdating ? (e) => {
                        if (e.key == "Enter") {
                            updateMessage(e)
                        }
                    } : (e) => {
                        if (e.key == "Enter") {
                            submit(e)
                        }
                    }} className='mt-auto d-flex' action="">
                        <textarea placeholder="Type your message here..." rows="1" value={message} onChange={(e) => setMessage(e.target.value)} className='form-control' type="text" name="message" id="message" ></textarea>
                        <button className='btn btn-warning fw-bold'>Send</button>
                        {isUpdating && <button className='btn btn-outline fw-bold'>Cancel</button>}
                    </form>
                </> : <div style={{ height: '100vh' }} className="d-flex justify-content-center align-items-center">
                    <p className='h5 empty-message fw-bold'>Choose a contact to begin messaging.</p>
                </div>
            }
        </div>
    )
}

export default Chat