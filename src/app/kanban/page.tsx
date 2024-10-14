'use client';

import React, { useEffect, useState} from "react";
import { Law } from './types';

const KanbanBoard: React.FC  = () => {
    const [laws, setLaws] = useState<Law[]>([]);

    useEffect(() => {
        // Trigger the /api/store-laws POST request to store laws
        const storeLaws = async () => {
            try {
                const response = await fetch('/api/store-laws', {
                    method: 'POST',  // Explicitly use POST method
                });

                if (!response.ok) {
                    throw new Error('Failed to store laws');
                }

                const data = await response.json();
                console.log('Laws stored:', data);

            } catch (error) {
                console.error('Error storing laws:', error);
            }
        };

        const fetchLaws = async () => {
            try {
                await fetch('/api/store-laws');
                const response = await fetch('/api/get-laws');
                const data = await response.json();

                const laws: Law[] = data.data.map((law: any) => ({
                    id: law.id,
                    statusId: law.statusId,
                    typeId: law.typeId,
                    periodId: law.periodId,
                    title: law.title,
                    titleCard: law.titleCard ?? law.title,
                    desc: law.desc,
                }));

                setLaws(laws);
            }
            catch (error) {
                console.error("error fetching laws:", error);
            }
        }

        storeLaws();
        fetchLaws();
    }, []);

    // TODO: Clean this up
    const statuses  = Array.from(new Set(laws.map((law) => law.statusId)));

    return (
        <div style={{ display: 'flex', gap: '2rem', padding: '1rem' }}>
            {statuses.map((statusId) => (
                <div key={statusId} style={{ border: '1px solid #ccc', padding: '1rem', minWidth: '250px' }}>
                    <h2>Status {statusId}</h2>
                    {laws
                        .filter((law) => law.statusId === statusId)
                        .map((law) => (
                            <div key={law.id} style={{ margin: '0.5rem 0', padding: '0.5rem', backgroundColor: '#000000' }}>
                                <h4>{law.titleCard}</h4>
                                <p>{law.desc}</p>
                            </div>
                        ))}
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;