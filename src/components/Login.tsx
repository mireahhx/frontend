import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://api.micmaclaynd.ru/avito/api/auth/login', {
                email,
                password,
            }, {
                withCredentials: true, // Добавлено для отправки cookies с запросом
            });
            console.log('Login successful', response.data);
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
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
            <button onClick={handleLogin}>Login</button>
            <p>
                Not registered yet? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default Login;
