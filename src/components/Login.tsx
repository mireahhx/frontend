import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('admin')
    const [password, setPassword] = useState<string>('admin')
    const navigate = useNavigate()

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://avito.micmaclaynd.ru/api/auth/login', {
                username, password
            })
            console.log('Login successful', response.data)
            navigate('/prices')
        } catch (error) {
            console.error('Login failed', error)
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <input
                type='email'
                value={username}
                defaultValue={'admin'}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Email'
            />
            <input
                type='password'
                value={password}
                defaultValue={'admin'}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
            />
            <button onClick={handleLogin}>Login</button>
            <p>
                Not registered yet? <Link to='/admin/register'>Register here</Link>
            </p>
        </div>
    )
}

export default Login
