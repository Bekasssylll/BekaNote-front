import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState({ title: '', body: '', category: 'PERSONAL' });
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [totalNotesCount, setTotalNotesCount] = useState(0);
    const [donedNotes, setDonedNotes] = useState(0);
    const [notDonedNotes, setNotDonedNotes] = useState(0);

    const categories = [
        { value: 'BUSINESS', label: 'Business' },
        { value: 'PERSONAL', label: 'Personal' },
        { value: 'IMPORTANT', label: 'Important' },
    ];
// PATTERN OBSERVER
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/notes/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
            .then(response => {
                const notesData = response.data.notes;
                setNotes(notesData);
                setTotalNotesCount(response.data.total_notes_count);

                const completedNotes = notesData.filter(note => note.is_done === "СДЕЛАНО").length;
                setDonedNotes(completedNotes);
                const notCompletedNotes = notesData.filter(note => note.is_done !== "СДЕЛАНО").length;
                setNotDonedNotes(notCompletedNotes);

                setLoading(false);
            })
            .catch(error => {
                console.error('Ошибка при загрузке списка заметок:', error);
                setError('Не удалось загрузить заметки');
                setLoading(false);
            });

        const token = localStorage.getItem('access_token');
        if (token) {
            axios.get('http://127.0.0.1:8000/user/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setUser(response.data);
                })
                .catch(error => {
                    console.error('Ошибка при загрузке данных пользователя:', error);
                });
        }
    }, []);

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
                setTotalNotesCount(totalNotesCount + 1);
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

            {user ? (
                <div style={styles.profile}>
                    <p>Привет, {user.username}!</p>
                    <button onClick={handleLogout} style={styles.logoutButton}>Выйти</button>
                </div>
            ) : (
                <div style={styles.authButtons}>
                    <Link to="/login" style={styles.loginButton}>Войти</Link>
                    <Link to="/register" style={styles.registerButton}>Зарегистрироваться</Link>
                    <Link to="https://t.me/BekossykBot" style={styles.telegramButton} target="_blank" rel="noopener noreferrer">
                        <img src="/Telegram_logo.svg.webp" alt="T" style={styles.telegramImage} />
                    </Link>
                </div>
            )}

            <div style={styles.parentCount}>
                <div style={styles.notesCount}>
                    <p>Всего заметок: {totalNotesCount}</p>
                </div>

                <div style={styles.donedNotesCount}>
                    <p>Завершенные заметки: {donedNotes}</p>
                </div>
                <div style={styles.notDonedNotesCount}>
                    <p>Незавершенные заметки: {notDonedNotes}</p>
                </div>
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
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textDecoration: 'none',
        color: '#000',
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
    },
    cardContent: {
        fontSize: '16px',
        marginBottom: '10px',
    },
    cardStatus: {
        fontSize: '14px',
        color: '#777',
    },
    loader: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#555',
        padding: '50px',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: '20px',
    },

    logoutButton: {
        backgroundColor: '#d9534f',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    loginButton: {
        color: '#2196F3',
        padding: '10px 20px',
        textDecoration: 'none',
        fontWeight: 'bold',
        border: 'none',
        cursor: 'pointer',
        // marginLeft:'350px',

    },
    registerButton: {
        color: '#2196F3',
        padding: '10px 20px',
        textDecoration: 'none',
        fontWeight: 'bold',
        border: 'none',
        cursor: 'pointer',
        // marginLeft:'60px',
    },
    notDonedNotesCount: {
        fontSize: '20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        margin: '0',
        padding: '0',
    },

    donedNotesCount: {
        fontSize: '20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        margin: '0',
        padding: '0',
    },

    notesCount: {
        fontSize: '20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        margin: '0',
        padding: '0',
    },

    parentCount: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        width: '100%',
        padding: '1px',
        margin: '0',
    },
    telegramButton: {
        padding: '10px 20px',
        backgroundColor: '#0088cc',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '5px',
    },
    telegramImage:{
        width:'30x',
        height:'20px'
    }




};

export default Notes;
