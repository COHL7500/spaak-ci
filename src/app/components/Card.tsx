'use client';

import React, {CSSProperties} from 'react';

interface CardProps {
    title: string;
    desc: string;
}


// TODO: Some more styling. Maybe MUI instead?
const CardStyle: CSSProperties = {
    margin: '0.5rem 0',
    padding: '1rem',
    backgroundColor: '#285ddd',
    borderRadius: 'var(--border-radius)',
    overflowWrap: 'break-word',
};

const titleStyle: CSSProperties = {
    marginBottom: '0.5rem',
}

const descStyle: CSSProperties = {
    fontSize: '0.9rem',
}

const Card = ({ title, desc }: CardProps) => {
    return (
        <div style={CardStyle}>
            <h4 style={titleStyle}>{title}</h4>
            <p style={descStyle}>{desc}</p>
        </div>
    );
};

export default Card;