import { Share2, Copy, Download, ChevronDown, Loader2, Sparkles, RefreshCcw, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { CreateSpaceDialog } from './CreateSpaceDialog';
import { ExportDropdown } from './ExportDropdown';

export function ActionBar({ 
    profileUrl,
    copyToClipboard,
    activeSpace,
    spacename,
    setSpaceName,
    headingQues,
    setHeadingQues,
    spaceError,
    titleError,
    createSpace,
    exportData,
    summarizeMessages,
    isLoading2,
    fetchMessages,
    isLoading
}) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 backdrop-blur-lg bg-opacity-95 border border-gray-100">
            {/* Share URL Section */}
            <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                    <Share2 className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-800">Share Your Space</h3>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Input
                                value={profileUrl}
                                readOnly
                                className="pr-28 bg-gray-50 border-gray-200 hover:border-gray-400 transition-colors text-gray-600"
                            />
                            <Button
                                onClick={copyToClipboard}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors gap-2 h-8"
                            >
                                <Copy className="h-4 w-4" />
                                Copy
                            </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Share this URL to receive messages in your "{activeSpace || 'selected'}" space
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions Section */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <CreateSpaceDialog
                    spacename={spacename}
                    setSpaceName={setSpaceName}
                    headingQues={headingQues}
                    setHeadingQues={setHeadingQues}
                    spaceError={spaceError}
                    titleError={titleError}
                    createSpace={createSpace}
                />

                <div className="flex items-center gap-3">
                    <ExportDropdown exportData={exportData} />

                    <Button
                        onClick={summarizeMessages}
                        className="bg-gray-600 hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-gray-200"
                        disabled={isLoading2}
                    >
                        {isLoading2 ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Sparkles className="h-5 w-5 mr-2 text-white-500" />
                        )}
                        Summarize
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => fetchMessages(true)}
                        disabled={isLoading}
                        className="hover:border-gray-400 hover:text-gray-700 transition-colors border-gray-200"
                    >
                        <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>
        </div>
    );
} 