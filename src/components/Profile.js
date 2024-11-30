import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (token) {
            axios.get('http://127.0.0.1:8000/api/register/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setUser(response.data);
                    setFormData(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    setError('Ошибка при получении данных пользователя');
                    console.error('Ошибка при получении данных пользователя', error.response?.data || error);
                    setLoading(false);
                    if (error.response?.status === 401) {
                        setError('Сессия истекла. Пожалуйста, войдите в систему.');
                    }
                });
        } else {
            setError('Токен не найден. Пожалуйста, войдите в систему.');
            setLoading(false);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');

        axios.put('http://127.0.0.1:8000/api/register/', formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setUser(response.data);
                setEditing(false);
                setError(null);
            })
            .catch(error => {
                setError('Ошибка при обновлении данных');
                console.error('Ошибка при обновлении данных', error.response?.data || error);
            });
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={styles.profileContainer}>
            <h2>Профиль пользователя</h2>
            {editing ? (
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label>
                        Логин:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </label>
                    <label>
                        Полное имя:
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </label>
                    <label>
                        Город:
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </label>
                    <label>
                        Дата рождения:
                        <input
                            type="date"
                            name="birthdate"
                            value={formData.birthdate}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </label>
                    <button type="submit" style={styles.button}>Сохранить</button>
                </form>
            ) : (
                <div style={styles.profileInfo}>
                    <p><strong>Логин:</strong> {user.username}</p>
                    <p><strong>Полное имя:</strong> {user.full_name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Город:</strong> {user.city}</p>
                    <p><strong>Дата рождения:</strong> {new Date(user.birthdate).toLocaleDateString()}</p>
                    <button onClick={() => setEditing(true)} style={styles.button}>Редактировать</button>
                </div>
            )}
        </div>
    );
}

const styles = {
    profileContainer: {
        padding: '20px',
        backgroundColor: '#fff',
        maxWidth: '800px',
        margin: '20px auto',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    profileInfo: {
        fontSize: '16px',
        lineHeight: '1.5',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    input: {
        padding: '8px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    }
};

export default Profile;
