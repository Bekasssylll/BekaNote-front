import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState({ title: '', body: '', category: 'PERSONAL' });
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);  // Хранение данных пользователя
    const [totalNotesCount, setTotalNotesCount] = useState(0);  // Хранение общего количества заметок

    const categories = [
        { value: 'BUSINESS', label: 'Business' },
        { value: 'PERSONAL', label: 'Personal' },
        { value: 'IMPORTANT', label: 'Important' },
    ];

    useEffect(() => {
        // Запрос для получения заметок
        axios.get('http://127.0.0.1:8000/notes/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then(response => {
                setNotes(response.data.notes);  // Сохраняем заметки
                setTotalNotesCount(response.data.total_notes_count);  // Сохраняем количество заметок
                setLoading(false);
            })
            .catch(error => {
                console.error('Ошибка при загрузке списка заметок:', error);
                setError('Не удалось загрузить заметки');
                setLoading(false);
            });

        // Запрос для получения данных пользователя
        const token = localStorage.getItem('access_token');
        if (token) {
            axios.get('http://127.0.0.1:8000/user/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setUser(response.data);  // Сохраняем данные пользователя
                })
                .catch(error => {
                    console.error('Ошибка при загрузке данных пользователя:', error);
                });
        }
    }, []);

    // Обработчик добавления заметки
    const handleAddNote = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        setLoading(true);

        axios.post('http://127.0.0.1:8000/notes/', newNote, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setNotes([response.data, ...notes]);
                setTotalNotesCount(totalNotesCount + 1);  // Обновляем количество заметок
                setNewNote({ title: '', body: '', category: 'PERSONAL' });
                setLoading(false);
            })
            .catch(error => {
                console.error('Ошибка при добавлении заметки:', error);
                setError('Не удалось добавить заметку');
                setLoading(false);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewNote(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        window.location.reload();
    };

    if (loading && !error) {
        return <div style={styles.loader}>Загрузка...</div>;
    }

    return (
        <div style={styles.container}>
            {error && <div style={styles.error}>{error}</div>}

            {/* Отображение данных пользователя */}
            {user ? (
                <div style={styles.profile}>
                    <p>Привет, {user.username}!</p>
                    <button onClick={handleLogout} style={styles.logoutButton}>Выйти</button>
                </div>
            ) : (
                <div style={styles.authButtons}>
                    <Link to="/login" style={styles.loginButton}>Войти</Link>
                    <Link to="/register" style={styles.registerButton}>Зарегистрироваться</Link>
                </div>
            )}

            {/* Отображение общего количества заметок */}
            <div style={styles.notesCount}>
                <p>Всего заметок: {totalNotesCount}</p>
            </div>

            <form onSubmit={handleAddNote} style={styles.form}>
                <input
                    type="text"
                    name="title"
                    placeholder="Заголовок заметки"
                    value={newNote.title}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                />
                <textarea
                    name="body"
                    placeholder="Текст заметки"
                    value={newNote.body}
                    onChange={handleInputChange}
                    required
                    style={styles.textarea}
                />
                <select
                    name="category"
                    value={newNote.category}
                    onChange={handleInputChange}
                    style={styles.select}
                >
                    {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                            {category.label}
                        </option>
                    ))}
                </select>
                <button type="submit" style={styles.addButton} disabled={loading}>Добавить заметку</button>
            </form>

            <div style={styles.grid}>
                {notes.map(note => (
                    <Link
                        to={`/notes/${note.id}`}
                        key={note.id}
                        style={{
                            ...styles.card,
                            backgroundColor: note.is_done === "СДЕЛАНО"
                                ? '#d4edda'
                                : note.is_done === "В ПРОЦЕССЕ"
                                    ? '#fff3cd'
                                    : '#fff',
                            borderColor: note.is_done === "СДЕЛАНО"
                                ? '#28a745'
                                : note.is_done === "В ПРОЦЕССЕ"
                                    ? '#ffc107'
                                    : '#ccc',
                        }}
                    >
                        <h2 style={styles.cardTitle}>{note.title}</h2>
                        <p style={styles.cardContent}>
                            {note.body.substring(0, 100)}...
                        </p>
                        <p style={styles.cardStatus}>
                            {note.is_done}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '2px',
        backgroundColor: '#f4f4f9',
        minHeight: '100vh',
    },
    profile: {
        marginBottom: '20px',
        textAlign: 'center',
    },
    authButtons: {
        marginBottom: '20px',
        textAlign: 'center',
        position:"absolute",
        right:'181px',
        top:'25px',
        gap:'1px',
        display:'flex',
        fontSize:'18px'
    },
    form: {
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    select: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: '10px 20px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
    },
    card: {
        display: 'block',
        padding: '15px',
        textDecoration: 'none',
        color: '#333',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: '1px solid #ccc',
    },
    cardTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    cardContent: {
        fontSize: '14px',
        color: '#555',
    },
    cardStatus: {
        fontSize: '12px',
        color: '#999',
        marginTop: '10px',
    },
    logoutButton: {
        backgroundColor: '#d9534f',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        cursor: 'pointer',
        borderRadius: '5px',
        fontSize: '16px',
    },
    loginButton: {
        color: '#2196F3', // синий цвет текста
        padding: '10px 20px',
        textDecoration: 'none', // убираем подчеркивание
        fontWeight: 'bold', // сделаем текст жирным (по желанию)
        border: 'none', // убираем границу
        cursor: 'pointer', // добавляем курсор для кнопки
    },
    registerButton: {
        color: '#2196F3', // синий цвет текста
        padding: '10px 20px',
        textDecoration: 'none', // убираем подчеркивание
        fontWeight: 'bold', // сделаем текст жирным (по желанию)
        border: 'none', // убираем границу
        cursor: 'pointer', // добавляем курсор для кнопки
    },
    notesCount: {
        marginBottom: '20px',
        fontSize: '20px',
        textAlign: 'center',
    },
    loader: {
        textAlign: 'center',
        fontSize: '24px',
        marginTop: '20px',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        fontSize: '18px',
    }
};

export default Notes;
