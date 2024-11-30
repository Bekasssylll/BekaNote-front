import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username,
                password
            });

            localStorage.setItem('access_token', response.data.access);
            navigate('/profile');
        } catch (error) {
            setError('Неверный логин или пароль');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Вход</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="username"
                    placeholder="Логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>Войти</button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f9f9f9',
        maxWidth: '400px',
        margin: '40px auto',
        borderRadius: '10px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    button: {
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        fontSize: '14px',
    }
};

export default Login;
