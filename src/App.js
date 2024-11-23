// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom'; // Добавляем Link
import Notes from './components/Notes';
import NoteDetail from './components/NoteDetail';

function App() {
    return (
        <Router>
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Link to="/"> {/* Оборачиваем изображение в Link */}
                        <img
                            src="https://aroundsketch.github.io/Apple-App-Icons/App-Icon/Apple/Notes/@PNG.png" // Замените на вашу ссылку или локальный путь
                            alt="BekaNote Logo"
                            style={{
                                maxWidth: '100%',
                                height: '55px',
                                borderRadius: '8px',
                                maxHeight: '20x',
                                position: 'absolute',
                                top: '21px',
                                left: '545px',
                                cursor: 'pointer', // Добавляем курсор-указатель
                            }}
                        />
                    </Link>
                </div>
                <h1 style={styles.title}>BekaNote</h1>
                <Routes>
                    <Route path="/" element={<Navigate to="/notes" replace />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/notes/:identifier" element={<NoteDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

const styles = {
    title: {
        textAlign: 'center',  // Центрируем текст
        fontSize: '36px',     // Увеличиваем размер шрифта
        fontWeight: 'bold',   // Делаем текст жирным
        color: 'black',       // Цвет текста
        margin: '20px 0',     // Отступы сверху и снизу
        fontFamily: 'Arial, sans-serif', // Шрифт Arial
    },
};

export default App;
