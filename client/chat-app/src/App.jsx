import { useState } from 'react'

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatLayout from './layouts/ChatLayout';
import Chat from './components/Chat';
import { ChatContext } from './contexts/ChatContext';
import io from 'socket.io-client';

import './App.css';

const router = createBrowserRouter(

  createRoutesFromElements(
    <Route>

      <Route path="/" element={<LoginPage />} />
      <Route path="chats" element={<ChatLayout />} >
        <Route path="user" element={<Chat />} />
      </Route>
    </Route>
  )
);

const socket = io.connect("http://localhost:3001", { autoConnect: false, 'forceNew': true });

function App() {

  const [loggedInUser, setLoggedInUser] = useState({});

  const [currentUserInChat, setCurrentUserInChat] = useState({});

  const [users, setUsers] = useState([]);

  const [notifications, setNotifications] = useState({});

  const [messages, setMessages] = useState([])

  const [message, setMessage] = useState('');
  const [idToUpdate, setIdToUpdate] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <ChatContext.Provider value={{ users, setUsers, messages, loggedInUser, currentUserInChat, setCurrentUserInChat, socket, setLoggedInUser, setMessages, notifications, setNotifications, message, setMessage, idToUpdate, setIdToUpdate, isUpdating, setIsUpdating }}>
      <RouterProvider router={router} />
    </ChatContext.Provider>
  )
}

export default App
