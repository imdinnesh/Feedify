'use client';

import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { ActionBar } from '@/components/dashboard/ActionBar';
import { MessageCard } from '@/components/MessageCard';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { useDashboard } from '@/hooks/useDashboard';

function UserDashboard() {
    const { data: session } = useSession();
    const { toast } = useToast();
    
    const {
        messages,
        isLoading,
        isLoading2,
        isSwitchLoading,
        spacename,
        spaces,
        activeSpace,
        headingQues,
        summary,
        summaryChunks,
        spaceError,
        titleError,
        acceptMessages,
        form,
        handleDeleteMessage,
        handleSwitchChange,
        setSpaceName,
        setHeadingQues,
        createSpace,
        setActiveSpace,
        copyToClipboard,
        exportData,
        summarizeMessages,
        clearSummary,
        fetchMessages,
        profileUrl,
        getEmbedCode
    } = useDashboard({ session, toast });

    if (!session || !session.user) {
        return <div></div>;
    }

    const activeMessages = messages.filter((message) => message.space_name === activeSpace);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
                <QuickStats 
                    activeMessages={activeMessages}
                    activeSpace={activeSpace}
                    spaces={spaces}
                    setActiveSpace={setActiveSpace}
                    acceptMessages={acceptMessages}
                    form={form}
                    handleSwitchChange={handleSwitchChange}
                    isSwitchLoading={isSwitchLoading}
                />
                
                <div className="mt-8">
                    <ActionBar 
                        profileUrl={profileUrl}
                        copyToClipboard={copyToClipboard}
                        activeSpace={activeSpace}
                        spacename={spacename}
                        setSpaceName={setSpaceName}
                        headingQues={headingQues}
                        setHeadingQues={setHeadingQues}
                        spaceError={spaceError}
                        titleError={titleError}
                        createSpace={createSpace}
                        exportData={exportData}
                        summarizeMessages={summarizeMessages}
                        isLoading2={isLoading2}
                        fetchMessages={fetchMessages}
                        isLoading={isLoading}
                        getEmbedCode={getEmbedCode}

                    />
                </div>

                {/* Summary Card with proper spacing */}
                {(summary || summaryChunks?.length > 0) && (
                    <div className="mt-8 mb-8">
                        <SummaryCard 
                            summary={summary}
                            summaryChunks={summaryChunks}
                            clearSummary={clearSummary}
                        />
                    </div>
                )}

                {/* Messages Grid */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {activeMessages.length > 0 ? (
                        activeMessages.map((message) => (
                            <MessageCard
                                key={message._id}
                                message={message}
                                onMessageDelete={handleDeleteMessage}
                                activeSpace={activeSpace}

                            />
                        ))
                    ) : (
                        <div className="col-span-2">
                            <Card className="bg-white">
                                <CardContent className="p-12 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare className="h-8 w-8 text-gray-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Messages Yet</h3>
                                    <p className="text-gray-500 max-w-sm mx-auto">
                                        Share your space link to start receiving messages from others.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;