import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

export default function Landing() {
    const [name, setName] = useState('');
    const [sessionId, setSessionId] = useState('');
    const navigate = useNavigate();

    const createSession = async () => {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/create-session`);
        navigate(`/room/${res.data.sessionId}`, { state: { name } });
    };

    const joinSession = () => {
        navigate(`/room/${sessionId}`, { state: { name } });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>💸 Negotiation App</h2>
                <span>Negotiate your price live with others!</span>
            </header>

            <div className={styles.panels}>
                {/* Create Session */}
                <div className={styles.panel}>
                    <h2>Create a Session</h2>
                    <input
                        className={styles.input}
                        placeholder="Your Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <button
                        className={styles.createButton}
                        onClick={createSession}
                        disabled={!name}
                    >
                     + Create New Session
                    </button>
                </div>

                {/* Join Session */}
                <div className={styles.panel}>
                    <h2>Join a Session</h2>
                    <input
                        className={styles.input}
                        placeholder="Your Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        placeholder="Session ID"
                        value={sessionId}
                        onChange={e => setSessionId(e.target.value)}
                    />
                    <button
                        className={styles.joinButton}
                        onClick={joinSession}
                        disabled={!name || !sessionId}
                    >
                        Join Session
                    </button>
                </div>
            </div>
        </div>
    );
}
