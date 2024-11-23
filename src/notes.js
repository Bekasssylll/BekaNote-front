// src/components/Notes.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Notes() {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/notes/')
            .then(response => {
                setNotes(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note => (
                    <li key={note.id}>{note.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default Notes;
