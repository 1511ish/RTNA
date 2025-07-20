import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import styles from './Room.module.css';

const socket = io(process.env.REACT_APP_BACKEND_BASE_URL);

export default function Room() {
    const { sessionId } = useParams();
    const { state } = useLocation();
    const [offers, setOffers] = useState([]);
    const [newOffer, setNewOffer] = useState('');

    const [sessionEnded, setSessionEnded] = useState(false);
    const [winner, setWinner] = useState(null);
    const [finalAmount, setFinalAmount] = useState(null);

    useEffect(() => {
        socket.emit('join-session', { sessionId, username: state.name });

        axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/session/${sessionId}`)
            .then(res => {
                setOffers(res.data.offers);
                if (res.data.ended) {
                    const acceptedOffer = res.data.offers.find(o => o.status === 'accepted');
                    setSessionEnded(true);
                    setWinner(acceptedOffer?.from);
                    setFinalAmount(acceptedOffer?.amount);
                }
            });

        socket.on('offer-received', (offer) => setOffers(prev => [...prev, offer]));
        socket.on('offer-accepted', ({ amount, from }) => {
            setOffers(prev =>
                prev.map(o =>
                    o.amount === amount && o.status === 'pending'
                        ? { ...o, status: 'accepted' }
                        : o
                )
            );
        });
        socket.on('offer-declined', ({ amount }) => {
            setOffers(prev =>
                prev.map(o =>
                    o.amount === amount && o.status === 'pending'
                        ? { ...o, status: 'declined' }
                        : o
                )
            );
        });
        socket.on('session-ended', ({ amount, from }) => {
            setSessionEnded(true);
            setWinner(from);
            setFinalAmount(amount);
        });

        return () => {
            socket.off('offer-received');
            socket.off('offer-accepted');
            socket.off('offer-declined');
            socket.off('session-ended');
        };
    }, [sessionId, state.name]);

    const sendOffer = () => {
        const lastOffer = offers[offers.length - 1];
        if (lastOffer && lastOffer.status === 'pending' && lastOffer.from !== state.name) {
            alert("Please accept or decline the previous offer before sending a new one.");
            return;
        }

        const amountInt = parseInt(newOffer);
        if (!amountInt || amountInt <= 0) {
            alert("Please enter a valid positive number.");
            return;
        }
        socket.emit('new-offer', { sessionId, amount: amountInt, from: state.name });
        setNewOffer('');
    };

    const acceptOffer = (offer) => {
        socket.emit('accept-offer', { sessionId, amount: offer.amount, from: state.name });
    };

    const declineOffer = (offer) => {
        socket.emit('decline-offer', { sessionId, amount: offer.amount, from: offer.from });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>💸 Negotiation Room</h2>
                <span>Session Id: {sessionId}</span>
                <span>You: {state.name}</span>
            </header>

            <main className={styles.chatArea}>
                <div className={styles.offerList}>
                    {offers.map((offer, idx) => (
                        <div
                            key={idx}
                            className={`${styles.offerItem} ${offer.from === state.name
                                ? styles.myOffer
                                : styles.incomingOffer
                                }`}
                        >
                            <div>
                                <strong>{offer.from}</strong>: ₹{offer.amount} ({offer.status})
                            </div>

                            {!sessionEnded &&
                                offer.status === 'pending' &&
                                offer.from !== state.name && (
                                    <div className={styles.offerButtons}>
                                        <button
                                            onClick={() => acceptOffer(offer)}
                                            className={styles.acceptButton}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => declineOffer(offer)}
                                            className={styles.declineButton}
                                        >
                                            Decline
                                        </button>
                                    </div>
                                )}
                        </div>
                    ))}
                </div>
            </main>

            {sessionEnded ? (
                <div style={{ fontWeight: 'bold', color: 'green', marginBottom: '1rem', textAlign: 'center' }}>
                    🎉 Congratulations! {winner} accepted the offer of ₹{finalAmount}. Session has ended.
                </div>
            ) : (
                <footer className={styles.footer}>
                    <input
                        className={styles.newOfferInput}
                        type="number"
                        placeholder="Your offer"
                        value={newOffer}
                        onChange={e => setNewOffer(e.target.value)}
                    />
                    <button
                        onClick={sendOffer}
                        className={styles.sendButton}
                    >
                        Send
                    </button>
                </footer>
            )}
        </div>
    );
}
