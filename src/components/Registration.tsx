import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Registration: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('https://api.micmaclaynd.ru/avito/api/auth/register', {
                email,
                password,
            }, {
                withCredentials: true, // Добавлено для отправки cookies с запросом
            });
            console.log('Registration successful', response.data);
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleRegister}>Register</button>
            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default Registration;
