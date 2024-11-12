import { Share2, Copy, Download, ChevronDown, Loader2, Sparkles, RefreshCcw, PlusCircle, Code2, Link, FileText } from 'lucide-react';
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
    isLoading,
    getEmbedCode
}) {
    return (
        <div className="bg-white/95 rounded-xl shadow-lg p-8 mb-8 backdrop-blur-lg border border-gray-200 transition-all hover:shadow-xl">
            {/* Share URL Section */}
            <div className="mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-50">
                            <Share2 className="h-5 w-5 text-gray-700" />
                        </div>
                        <h3 className="font-semibold text-gray-800 text-lg">Share Your Space</h3>
                    </div>
                    <CreateSpaceDialog
                        spacename={spacename}
                        setSpaceName={setSpaceName}
                        headingQues={headingQues}
                        setHeadingQues={setHeadingQues}
                        spaceError={spaceError}
                        titleError={titleError}
                        createSpace={createSpace}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="relative group">
                            <Input
                                value={profileUrl}
                                readOnly
                                className="pr-28 bg-gray-50 border-gray-200 group-hover:border-gray-400 transition-all duration-200 text-gray-600 focus:ring-2 focus:ring-gray-200"
                            />
                            <Button
                                onClick={copyToClipboard}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 gap-2 h-8 hover:shadow-sm"
                            >
                                <Copy className="h-4 w-4" />
                                Copy
                            </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-3">
                            Share this URL to receive messages in your "<span className="font-medium text-gray-700">{activeSpace || 'selected'}</span>" space
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions Section */}
            <div className="flex flex-wrap gap-6 items-center justify-between">
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(`${window.location.origin}/feedback/${activeSpace}`)}
                        className="hover:bg-gray-50 transition-all duration-200"
                    >
                        <Link className="h-4 w-4 mr-2" />
                        Copy Link
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={getEmbedCode}
                        className="hover:bg-gray-50 transition-all duration-200"
                    >
                        <Code2 className="h-4 w-4 mr-2" />
                        Embed
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <ExportDropdown exportData={exportData} />

                    <Button
                        onClick={summarizeMessages}
                        className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg text-white"
                        disabled={isLoading2}
                    >
                        {isLoading2 ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Sparkles className="h-5 w-5 mr-2" />
                        )}
                        Summarize
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => fetchMessages(true)}
                        disabled={isLoading}
                        className="hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 transition-all duration-200 p-2"
                    >
                        <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>
        </div>
    );
} 