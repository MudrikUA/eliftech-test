import React from 'react';

export default function NotFound() {

    return (
        <div className="not-found" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f8f9fa',
            textAlign: 'center',
        }}>
            <h1 style={{
                fontSize: '6rem',
                color: '#dc3545',
                marginBottom: '1rem',
                fontWeight: 'bold'
            }}>404</h1>
            <h2 style={{
                fontSize: '2rem',
                color: '#343a40',
                marginBottom: '1rem'
            }}>Page Not Found</h2>
            <p style={{
                fontSize: '1.2rem',
                color: '#6c757d',
                maxWidth: '500px',
                lineHeight: '1.6'
            }}>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        </div>
    )
}
