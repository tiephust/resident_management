import React, { useState, useEffect } from 'react';
import { fetchHelloMessage } from '../../services/api';
import MessageCard from '../../components/common/MessageCard';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';

const HomePage: React.FC = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getMessage = async () => {
            try {
                // Check if user is authenticated
                // if (!AuthService.isAuthenticated()) {
                //     navigate('/login');
                //     return;
                // }

                const data = await fetchHelloMessage();
                setMessage(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                if (err instanceof Error && err.message.includes('401')) {
                    navigate('/register');
                }
            } finally {
                setLoading(false);
            }
        };

        getMessage();
    }, [navigate]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Welcome to Resident Management System</h1>
            <MessageCard
                message={message}
                loading={loading}
                error={error}
            />
        </div>
    );
};

export default HomePage;