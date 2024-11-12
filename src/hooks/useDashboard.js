import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AcceptMessageSchema } from '@/schemes/acceptSchema';
import { CreateSpaceSchema } from '@/schemes/createSpaceSchema';
import axios from 'axios';

export function useDashboard({ session, toast }) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [spacename, setSpaceName] = useState('');
    const [spaces, setSpaces] = useState([]);
    const [activeSpace, setActiveSpace] = useState('');
    const [headingQues, setHeadingQues] = useState('');
    const [summary, setSummary] = useState('');
    const [spaceError, setSpaceError] = useState('');
    const [titleError, setTitleError] = useState('');
    const [summaryChunks, setSummaryChunks] = useState([]);

    const form = useForm({
        resolver: zodResolver(AcceptMessageSchema),
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    const handleDeleteMessage = (messageId) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get('/api/accept-messages');
            setValue('acceptMessages', response.data.isAcceptingMessages);
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data.message ?? 'Failed to fetch message settings',
                variant: 'destructive',
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue, toast]);

    const fetchMessages = useCallback(
        async (refresh) => {
            setIsLoading(true);
            try {
                const response = await axios.get('/api/get-messages', {
                    params: { space_name: activeSpace }
                });
                setMessages(response.data.messages || []);
                if (refresh) {
                    toast({
                        title: 'Refreshed Messages',
                        description: 'Showing latest messages',
                    });
                }
            } catch (error) {
                toast({
                    title: 'Empty',
                    description: error.response?.data.message ?? 'Failed to fetch messages',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        },
        [toast, activeSpace]
    );

    const createSpace = async () => {
        try {
            setSpaceError('');
            setTitleError('');

            const validatedData = CreateSpaceSchema.parse({
                space: spacename,
                title: headingQues
            });

            const response = await axios.post('/api/create-spaces', {
                username: session.user.username,
                space: validatedData.space,
                title: validatedData.title
            });

            setSpaces([...spaces, spacename]);
            if (response.data.success) {
                toast({
                    title: 'Space Created',
                    description: 'A new space has been created.',
                    variant: 'success',
                });
                setSpaceName('');
                setHeadingQues('');
                document.querySelector('[data-dialog-close]')?.click();
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                error.errors.forEach((err) => {
                    if (err.path[0] === 'space') {
                        setSpaceError(err.message);
                    }
                    if (err.path[0] === 'title') {
                        setTitleError(err.message);
                    }
                });
                return;
            }

            toast({
                title: 'Error',
                description: error.response?.data.message ?? 'Failed to create a new space',
                variant: 'destructive',
            });
        }
    };

    const getSpaces = useCallback(async () => {
        try {
            const response = await axios.get('/api/get-spaces');
            if (response.data.spaces) {
                setSpaces(response.data.spaces);
            } else {
                throw new Error('Spaces data not found in response');
            }
        } catch (error) {
            console.error('Error fetching spaces:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to get spaces',
                variant: 'destructive',
            });
        }
    }, [toast]);

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post('/api/accept-messages', {
                acceptMessages: !acceptMessages,
            });
            setValue('acceptMessages', !acceptMessages);
            toast({
                title: response.data.message,
                variant: 'default',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data.message ?? 'Failed to update message settings',
                variant: 'destructive',
            });
        }
    };

    const baseUrl = typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.host}`
        : '';
    const profileUrl = session?.user?.username
        ? `${baseUrl}/public/${session.user.username}/${activeSpace}`
        : '';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast({
            title: 'URL Copied!',
            description: 'Profile URL has been copied to clipboard.',
        });
    };

    const exportData = async (format) => {
        if (!session || !session.user) return;
        await fetchMessages();

        const activeMessages = messages.filter((message) => message.space_name === activeSpace);

        if (activeMessages.length === 0) {
            toast({
                title: 'No Data',
                description: 'There are no messages to export.',
                variant: 'warning',
            });
            return;
        }

        let content, type, filename;

        if (format === 'json') {
            content = JSON.stringify(activeMessages, null, 2);
            type = 'application/json';
            filename = 'messages.json';
        } else if (format === 'csv') {
            const csvHeaders = Object.keys(activeMessages[0]).join(',');
            const csvRows = activeMessages.map(msg => Object.values(msg).join(',')).join('\n');
            content = `${csvHeaders}\n${csvRows}`;
            type = 'text/csv';
            filename = 'messages.csv';
        }

        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: 'Export Successful',
            description: `Messages have been exported as ${format.toUpperCase()}.`,
            variant: 'success',
        });
    };

    const summarizeMessages = async () => {
        setIsLoading2(true);
        setSummaryChunks([]);
        try {
            const activeMessages = messages.filter((message) => message.space_name === activeSpace);

            if (activeMessages.length === 0) {
                toast({
                    title: 'No Messages',
                    description: 'There are no messages to summarize.',
                    variant: 'warning',
                });
                return;
            }

            const response = await fetch('/api/summarize-messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: activeMessages.map(message => message.content),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to start summarization');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Helper function to add random delay for more natural feeling
            const delay = () => new Promise(resolve => {
                // Random delay between 150ms and 300ms
                const randomDelay = Math.floor(Math.random() * (300 - 150 + 1)) + 150;
                setTimeout(resolve, randomDelay);
            });

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                setSummaryChunks(prev => [...prev, chunk]);

                // Add a variable delay between chunks
                await delay();
            }

            toast({
                title: 'Summary Generated',
                description: 'Your messages have been summarized.',
                variant: 'success',
            });
        } catch (error) {
            console.error('Summarization error:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to summarize messages',
                variant: 'destructive',
            });
        } finally {
            setIsLoading2(false);
        }
    };

    const clearSummary = () => {
        setSummary('');
        setSummaryChunks([]);
    };

    const getEmbedCode = useCallback(() => {
        if (!activeSpace || !session?.user?.username) {
            toast({
                title: "Error",
                description: "Space or username not available",
                variant: "destructive"
            });
            return;
        }

        const embedCode = `<iframe
        src="${window.location.origin}/public-feedback.html?space_name=${encodeURIComponent(activeSpace)}&username=${encodeURIComponent(session.user.username)}"
        width="100%"
        height="500"
        style="border: none; width: 100%; max-width: 900px; margin: 0 auto; display: block; background: transparent;"
        ></iframe>`;

        try {
            navigator.clipboard.writeText(embedCode).then(() => {
                toast({
                    title: "Embed code copied!",
                    description: "The embed code has been copied to your clipboard.",
                    variant: "success"
                });
            }).catch((err) => {
                console.error('Failed to copy:', err);
                toast({
                    title: "Copy failed",
                    description: "Please try copying manually",
                    variant: "destructive"
                });
            });
        } catch (error) {
            console.error('Copy operation failed:', error);
            toast({
                title: "Copy failed",
                description: "Please try copying manually",
                variant: "destructive"
            });
        }
    }, [activeSpace, session?.user?.username, toast]);

    useEffect(() => {
        if (!session || !session.user) return;
        fetchMessages();
        getSpaces();
        fetchAcceptMessages();
    }, [session, fetchAcceptMessages, fetchMessages, getSpaces]);

    return {
        messages,
        isLoading,
        isLoading2,
        isSwitchLoading,
        spacename,
        spaces,
        activeSpace,
        headingQues,
        summary,
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
        summaryChunks,
        getEmbedCode,
    };
} 