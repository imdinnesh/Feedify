export function SummaryCard({ summaryChunks, clearSummary }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Summary
                    </h3>
                    <button 
                        onClick={clearSummary}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
                        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
                        disabled:pointer-events-none disabled:opacity-50
                        border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700
                        h-8 px-3 text-gray-600 dark:text-gray-300"
                    >
                        Clear
                    </button>
                </div>
            </div>
            <div className="p-4">
                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                    {summaryChunks.map((chunk, index) => (
                        <span 
                            key={index} 
                            className="transition-opacity duration-200 ease-in-out"
                            style={{ 
                                opacity: 1,
                                animation: 'fadeIn 0.5s ease-in-out'
                            }}
                        >
                            {chunk}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}