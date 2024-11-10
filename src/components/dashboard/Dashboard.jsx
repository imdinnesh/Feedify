import { useState } from 'react';
import { SummaryCard } from './SummaryCard';

function Dashboard() {
    const [summary, setSummary] = useState('');
    const [summaryChunks, setSummaryChunks] = useState([]);

    const clearSummary = () => {
        setSummary('');
        setSummaryChunks([]);
    };

    return (
        <div>
            {/* Other dashboard components */}
            {(summary || summaryChunks.length > 0) && (
                <SummaryCard
                    summary={summary}
                    summaryChunks={summaryChunks}
                    clearSummary={clearSummary}
                />
            )}
        </div>
    );
} 