import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Registration: React.FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleRegister = async () => {
        try {
            const response = await axios.post('https://api.micmaclaynd.ru/api/auth/register', {
                username, password,
            })
            console.log('Registration successful', response.data)
            navigate('/prices')
        } catch (error) {
            console.error('Registration failed', error)
        }
    }

    return (
        <div>
            <h2>Register</h2>
            <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleRegister}>Register</button>
            <p className='middle-link'>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    )
}

export default Registration
