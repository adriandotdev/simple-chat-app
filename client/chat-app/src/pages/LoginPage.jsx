import { useContext, useState } from 'react'
import { ChatContext } from '../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {

    const navigate = useNavigate();
    const { setUsers, setLoggedInUser } = useContext(ChatContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submit = async (e) => {

        e.preventDefault();

        if (!username || !password)
            alert("Please provide your username and password");
        else {

            try {
                const response = await axios.post('http://localhost:3001/api/v1/login', { username, password });

                setLoggedInUser(response.data.user);
                setUsers(response.data.registeredUsers);
                navigate('/chats/user');
            }
            catch (err) {
                alert("Invalid Credentials. Please check your username and password.")
            }
        }
    }

    return (
        <main style={{ minHeight: '100vh' }} className="d-flex align-items-center justify-content-center pt-3 pt-md-0">
            <div className="d-flex flex-column gap-5 flex-md-row align-items-md-center px-md-5">
                <div className='col d-flex flex-column justify-content-center align-items-center'>
                    <div>
                        <h1 className='p-0 login-title text-center'>Humble</h1>
                        <p className='text-center fw-bold'>Explore the true meaning of Love</p>
                    </div>
                    <form onSubmit={submit} style={{ maxWidth: '25rem' }} className='row justify-content-center p-0' action="">
                        <section className='p-0'>
                            <label htmlFor="username" className="form-label">Username</label>
                            <input onChange={(e) => setUsername(e.target.value)} className='form-control' type="text" name="username" id="username" />

                        </section>
                        <section className='p-0'>
                            <label htmlFor="password" className="form-label">Password</label>
                            <input onChange={(e) => setPassword(e.target.value)} className='form-control' type="password" name="password" id="password" />
                        </section>
                        <button className='btn btn-warning mt-5 fw-bold'>Login</button>
                    </form>
                </div>
                <div className='login-image w-full col'>
                    <img className='login-img' src="/login-image.jpg" alt="" />
                </div>
            </div>
        </main>
    )
}

export default LoginPage