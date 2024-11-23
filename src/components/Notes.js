import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState({ title: '', body: '', category: 'PERSONAL' });

    const categories = [
        { value: 'BUSINESS', label: 'Business' },
        { value: 'PERSONAL', label: 'Personal' },
        { value: 'IMPORTANT', label: 'Important' },
    ];

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/notes/')
            .then(response => {
                setNotes(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Ошибка при загрузке списка заметок:', error);
                setLoading(false);
            });
    }, []);

    const handleAddNote = (e) => {
        e.preventDefault();

        axios.post('http://127.0.0.1:8000/notes/', newNote)
            .then(response => {
                setNotes([response.data, ...notes]); // Добавляем новую заметку в начало списка
                setNewNote({ title: '', body: '', category: 'PERSONAL' }); // Очищаем форму
            })
            .catch(error => {
                console.error('Ошибка при добавлении заметки:', error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewNote(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    if (loading) {
        return <div style={styles.loader}>Загрузка...</div>;
    }

    return (
        <div style={styles.container}>
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
                <button type="submit" style={styles.addButton}>Добавить заметку</button>
            </form>

            <div style={styles.grid}>
                {notes.map(note => (
                    <Link
                        to={`/notes/${note.id}`}
                        key={note.id}
                        style={{
                            ...styles.card,
                            backgroundColor: note.is_done === "СДЕЛАНО" ? '#d4edda' : '#fff', // Если выполнено, зелёный фон
                            borderColor: note.is_done === "СДЕЛАНО" ? '#28a745' : '#ccc' // Зелёная рамка для выполненных
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
        color: '#888',
        marginTop: '10px',
    },
    loader: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#888',
        marginTop: '20px',
    },
};

export default Notes;
