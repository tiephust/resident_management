import React from 'react';
import { Typography, Card, CardContent } from '@mui/material';

interface MessageCardProps {
    message: string;
    loading?: boolean;
    error?: string | null;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, loading, error }) => {
    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <Card sx={{ minWidth: 275, margin: 2 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    Message from API:
                </Typography>
                <Typography variant="body1" sx={{ mt: 1.5 }}>
                    {message}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default MessageCard;