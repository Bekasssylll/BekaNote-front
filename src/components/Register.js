import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
        birthdate: '',
        city: '',
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', formData);
            // Сохраняем токен после регистрации
            localStorage.setItem('access_token', response.data.access_token);
            navigate('/profile');  // Перенаправляем на страницу профиля после успешной регистрации
        } catch (error) {
            setError(error.response?.data?.detail || 'Произошла ошибка при регистрации');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Регистрация</h2>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="username"
                    placeholder="Имя пользователя"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Электронная почта"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="text"
                    name="full_name"
                    placeholder="Полное имя"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="text"
                    name="city"
                    placeholder="Город"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Зарегистрироваться</button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '400px',
        margin: 'auto',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: '10px 20px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
};

export default Register;
