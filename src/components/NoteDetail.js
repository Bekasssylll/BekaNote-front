import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function NoteDetail() {
    const [note, setNote] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        category: '',
        is_done: '', // Добавляем статус
    });

    const { identifier } = useParams(); // Получаем slug или id из URL
    const navigate = useNavigate(); // Для перенаправления после удаления

    // Получаем токен из localStorage или другого места
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        // Проверка на наличие токена
        if (!token) {
            alert("Пожалуйста, войдите в систему.");
            navigate('/login'); // Перенаправление на страницу входа, если нет токена
            return;
        }

        axios.get(`http://127.0.0.1:8000/notes/${identifier}/`, {
            headers: {
                Authorization: `Bearer ${token}`, // Добавляем токен в заголовки
            },
        })
            .then(response => {
                setNote(response.data);
                setFormData({
                    title: response.data.title,
                    body: response.data.body,
                    category: response.data.category,
                    is_done: response.data.is_done,
                });
            })
            .catch(error => {
                console.error('Ошибка при загрузке заметки:', error);
                alert("Ошибка при загрузке заметки.");
            });
    }, [identifier, token, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const updateNote = () => {
        axios.put(`http://127.0.0.1:8000/notes/${identifier}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`, // Добавляем токен в заголовки
            },
        })
            .then(() => {
                alert("Заметка успешно обновлена!");
                navigate(`/notes/${identifier}/`); // Обновление заметки
            })
            .catch(error => {
                console.error("Ошибка при обновлении заметки:", error);
                alert("Не удалось обновить заметку.");
            });
    };

    const deleteNote = () => {
        axios.delete(`http://127.0.0.1:8000/notes/${identifier}/`, {
            headers: {
                Authorization: `Bearer ${token}`, // Добавляем токен в заголовки
            },
        })
            .then(() => {
                alert("Заметка успешно удалена!");
                navigate('/notes'); // Перенаправляем на список заметок
            })
            .catch(error => {
                console.error("Ошибка при удалении заметки:", error);
                alert("Не удалось удалить заметку.");
            });
    };

    if (!note) return <div style={styles.loader}>Загрузка...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <input
                    style={styles.inputTitle}
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Заголовок заметки"
                />
                <input
                    style={styles.inputCategory}
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Категория"
                />
            </div>
            <div style={styles.body}>
                <textarea
                    style={styles.textarea}
                    name="body"
                    value={formData.body}
                    onChange={handleInputChange}
                    placeholder="Содержимое заметки"
                />
            </div>
            <div style={styles.status}>
                <label>
                    Статус:
                    <select
                        name="is_done"
                        value={formData.is_done}
                        onChange={handleInputChange}
                        style={styles.select}
                    >
                        <option value="НЕ СДЕЛАНО">Не сделано</option>
                        <option value="В ПРОЦЕССЕ">В процессе</option>
                        <option value="СДЕЛАНО">Сделано</option>
                    </select>
                </label>
            </div>
            <div style={styles.footer}>
                <p style={styles.timestamp}>
                    Создано: {new Date(note.created).toLocaleDateString()} | Обновлено: {new Date(note.updated).toLocaleDateString()}
                </p>
                <button style={styles.updateButton} onClick={updateNote}>
                    Обновить заметку
                </button>
                <button style={styles.deleteButton} onClick={deleteNote}>
                    Удалить заметку
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f9f9f9',
        maxWidth: '800px',
        margin: '40px auto',
        borderRadius: '10px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    inputTitle: {
        width: '100%',
        padding: '10px',
        fontSize: '24px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    inputCategory: {
        width: '100%',
        padding: '8px',
        fontSize: '16px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    body: {
        marginTop: '20px',
    },
    textarea: {
        width: '100%',
        height: '200px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    status: {
        marginTop: '20px',
        textAlign: 'center',
    },
    select: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        marginLeft: '10px',
    },
    footer: {
        marginTop: '20px',
        textAlign: 'center',
    },
    timestamp: {
        fontSize: '14px',
        color: '#aaa',
        marginBottom: '10px',
    },
    updateButton: {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#3498db',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        marginRight: '10px',
    },
    deleteButton: {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#e74c3c',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    loader: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#888',
        marginTop: '20px',
    },
};

export default NoteDetail;
