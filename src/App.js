import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Notes from './components/Notes';
import NoteDetail from './components/NoteDetail';
import Register from './components/Register';  // Импортируем компонент регистрации
import Profile from './components/Profile';
import Login from "./components/Login";

function App() {
    const isAuthenticated = localStorage.getItem('access_token');

    return (
        <Router>
            <div>
                <div style={styles.headerContainer}>
                    <div style={styles.logoContainer}>
                        <Link to="/">
                            <img
                                src="/arsen.png"
                                alt="BekaNote Logo"
                                style={styles.logo}
                            />
                        </Link>
                    </div>
                    <h1 style={styles.title}>BekaNote</h1>
                </div>

                {/* Навигация для зарегистрированных пользователей */}
                <div style={styles.navContainer}>
                    {!isAuthenticated && (
                        <>
                            <Link to="/register" style={styles.navButton}>Зарегистрироваться</Link>
                            <Link to="/login" style={styles.navButton}>Войти</Link>
                        </>
                    )}
                    {isAuthenticated && (
                        <Link to="/profile" style={styles.navButton}>Мой профиль</Link>
                    )}
                </div>

                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/notes" replace />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/notes/:identifier" element={<NoteDetail />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

const styles = {
    headerContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        marginTop: '20px',
    },
    logoContainer: {
        marginRight: '20px',
    },
    logo: {
        maxWidth: '100%',
        height: '55px',
        borderRadius: '8px',
        cursor: 'pointer',
        position: 'absolute',
        top: '25px',
        left: '550px',
    },
    title: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: 'black',
        margin: '0',
    },
    navButton: {
        margin: '1px 20px',
        fontSize: '18px',
        color: '#2196F3',
        textDecoration: 'none',
        padding: '10px',
        display: 'inline-block',
        fontWeight: 'bold'
    },
    navContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        marginTop: '20px',
        marginLeft: '20px',
        position: 'absolute',
        right: '15px',
        top: '4px',
    },
};

export default App;
