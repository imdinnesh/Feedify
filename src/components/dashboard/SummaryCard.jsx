import { Sparkles, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function SummaryCard({ summary, clearSummary }) {
    return (
        <Card className="mb-8 bg-white hover:shadow-xl transition-all duration-300 border border-gray-100">
            <CardContent className="p-6 relative">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-gray-500" />
                        Message Summary
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearSummary}
                        className="h-8 w-8 p-0 hover:text-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <p className="text-gray-600 leading-relaxed">{summary}</p>
            </CardContent>
        </Card>
    );
} 