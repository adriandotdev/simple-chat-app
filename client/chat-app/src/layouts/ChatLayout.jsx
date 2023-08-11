import { useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import { ChatContext } from '../contexts/ChatContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChatLayout() {

    const navigate = useNavigate();
    const { loggedInUser, users, setUsers, setCurrentUserInChat, socket, setMessages, setLoggedInUser, notifications, setNotifications, setMessage, setIdToUpdate, setIsUpdating } = useContext(ChatContext);

    /**
     * @description
     * Get all of the logged in user's notification.
     */
    const fetchNotifications = async () => {

        const response = await axios.post(`http://localhost:3001/api/v1/notifications/${loggedInUser.username}`);

        setNotifications(response.data);
    }

    /**
     * @description
     * Join a user to its room.
     */
    const joinRoom = async () => {

        if (socket !== null)
            socket.disconnect();

        fetchNotifications();
        socket.connect();

        await socket.emit("join_room", loggedInUser);
    }

    /** 
     * @description
     * Get all the messages between loggedInUser, and 
     */
    const fetchMessages = async () => {

        const response = await axios.get('http://localhost:3001/api/v1/messages');

        setMessages([...response.data])
    }

    const logout = async () => {

        await axios.post('http://localhost:3001/logout', { username: loggedInUser.username });

        // Reset the global states.
        setCurrentUserInChat({});
        setLoggedInUser({});
        setNotifications({});
        socket.disconnect();
        navigate('/');

    }

    /** This will view the notifications of the current logged in user. */
    const viewNotifications = async () => {

        const response = await axios.post(`http://localhost:3001/api/v1/view/notification/${loggedInUser.username}`);

        setNotifications(response.data.notifications);
    }

    /**When the user is logged in, it will join to the room. */
    useEffect(() => {
        joinRoom();
    }, []);

    useEffect(() => {

        /** This event will trigger whenever there are new user is online */
        socket.on('new_online_user', (data) => {
            setUsers(data);
        })
    })

    return (
        <div style={{ height: '100vh' }} className='container-fluid row px-0'>
            <div style={{ border: '1px solid #F4F8FE' }} className='col-3 rounded pt-3 px-0'>
                <div className='px-1'>
                    <div className='d-flex flex-column-reverse justify-content-between flex-md-row flex- px-3 '>
                        <h5 className='user-profile-title'>{loggedInUser.name}</h5>

                        {/* Notification Icon */}
                        <div className="btn-group">
                            <div onClick={viewNotifications} className='notif' data-bs-toggle="dropdown" >
                                <img className='img-notif img-fluid' src="/notif.png" alt="" />
                                {
                                    notifications?.count > 0 && <div className="circle"></div>
                                }
                            </div>

                            {
                                notifications?.contents?.length > 0 ?
                                    <ul className="dropdown-menu notif-content">
                                        {
                                            notifications.contents.map((notif, index) => (
                                                <li key={index} className="dropdown-item">{notif}</li>
                                            ))
                                        }
                                    </ul> : <ul className="dropdown-menu">
                                        <li className='dropdown-item'>You do not have notifications</li>
                                    </ul>
                            }
                        </div>
                    </div>

                    <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center px-3">
                        <span className='fw-bold h4 d-block'>Contacts</span>
                        <span onClick={logout} className='btn-logout text-danger fw-bold d-block mb-2'>Logout</span>
                    </div>
                </div>

                {/* Contacts */}
                <div className='d-flex flex-column px-3'>
                    {
                        users.map((user, index) => {
                            return (
                                <div onClick={() => {

                                    setMessage('');
                                    setIdToUpdate('');
                                    setIsUpdating(false);
                                    setCurrentUserInChat(user);
                                    fetchMessages();
                                }} key={index} style={{ border: '.5px solid #F4F8FE' }} className='w-100 p-2 d-flex flex-column contact-item'>
                                    <span>{user.name}</span>
                                    {
                                        // If the user.username is equal to the loggedInUser, we don't need to display the Online status.
                                        user.username !== loggedInUser.username && <small className={`fw-bold ${user.isOnline ? 'text-success' : 'text-danger'}`}>{user.isOnline && "Online"}</small>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <Outlet />
        </div>
    )
}

export default ChatLayout