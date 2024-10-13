import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Loader2 } from 'lucide-react';

const SummariseButton = ({ onSummarise, isStreaming }) => {
    return (
        <Button
            variant="outline"
            onClick={onSummarise}
            disabled={isStreaming}
        >
            {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
                <MessageSquare className="h-4 w-4 mr-2" />
            )}
            {isStreaming ? 'Summarising...' : 'Summarise Messages'}
        </Button>
    );
};

export default SummariseButton;