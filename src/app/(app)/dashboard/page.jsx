'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2, RefreshCcw, Copy, PlusCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemes/acceptSchema';
import dayjs from 'dayjs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare } from 'lucide-react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function UserDashboard() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [spacename, setSpaceName] = useState('');
    const [spaces, setSpaces] = useState([]);
    const [activeSpace, setActiveSpace] = useState('')
    const [summary, setSummary] = useState('');

    const { toast } = useToast();

    const handleDeleteMessage = (messageId) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(AcceptMessageSchema),
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

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
            const response = await axios.post('/api/create-spaces', {
                username: session.user.username,
                space: spacename
            });
            setSpaces([...spaces, spacename]);
            if (response.data.success) {
                toast({
                    title: 'Space Created',
                    description: 'A new space has been created.',
                    variant: 'success',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data.message ?? 'Failed to create a new space',
                variant: 'destructive',
            });
        }
    }

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

    useEffect(() => {
        if (!session || !session.user) return;
        fetchMessages();
        getSpaces();
        fetchAcceptMessages();
    }, [session, fetchAcceptMessages, fetchMessages, getSpaces]);

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

    if (!session || !session.user) {
        return <div></div>;
    }

    const { username } = session.user;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/${username}/${activeSpace}`;

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

        if (messages.length === 0) {
            toast({
                title: 'No Data',
                description: 'There are no messages to export.',
                variant: 'warning',
            });
            return;
        }
        const activeMessages = messages.filter((message) => message.space_name === activeSpace);

        let content, type, filename;

        // Add logic to handle different formats (e.g., JSON, CSV)
        if (format === 'json') {
            content = JSON.stringify(activeMessages, null, 2);
            type = 'application/json';
            filename = 'messages.json';
        } else if (format === 'csv') {
            // Convert messages to CSV format
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

    const activeMessages = messages.filter((message) => message.space_name === activeSpace);
    const summarizeMessages = async () => {
        try {
            const response = await axios.post('/api/summarize-messages', {
                messages: activeMessages.map(message => message.content),
            });
            // console.log(response.data.summary);
            setSummary(response.data.summary);
            toast({
                title: 'Summary Generated',
                description: 'Your messages have been summarized.',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data.message ?? 'Failed to summarize messages',
                variant: 'destructive',
            });
        }
    };

    const clearSummary = () => {
        setSummary('');
    }


    return (
        <div className="my-8 mx-auto p-8 bg-white rounded-lg shadow-md w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">User Dashboard</h1>

            <div className="mb-8 space-y-6">
                <div className="flex items-center justify-between">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Space
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Space</DialogTitle>
                                <DialogDescription>
                                    Enter a name for your new space.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="spacename" className="text-right">
                                        Space Name
                                    </Label>
                                    <Input
                                        id="spacename"
                                        placeholder="Enter space name"
                                        className="col-span-3"
                                        onChange={(e) => setSpaceName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button onClick={createSpace}>Create Space</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {spaces.length > 0 && (
                        <Select onValueChange={setActiveSpace}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Choose Space" />
                            </SelectTrigger>
                            <SelectContent>
                                {spaces.map((space, key) => (
                                    <SelectItem key={key} value={space}>
                                        {space}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                <div className="bg-gray-100 p-4 rounded-md">
                    <h2 className="text-lg font-semibold mb-2">Your Unique Link</h2>
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={profileUrl}
                            readOnly
                            className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button onClick={copyToClipboard} className="rounded-l-none">
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                        </Button>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Switch
                        {...register('acceptMessages')}
                        checked={acceptMessages}
                        onCheckedChange={handleSwitchChange}
                        disabled={isSwitchLoading}
                    />
                    <span className="font-medium">
                        Accept Messages: {acceptMessages ? 'On' : 'Off'}
                    </span>
                </div>
            </div>

            <Separator className="my-8" />

            <div className="flex items-center justify-between mb-8">
                <Button
                    variant="outline"
                    onClick={() => fetchMessages(true)}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <RefreshCcw className="h-4 w-4 mr-2" />
                    )}
                    Refresh Messages
                </Button>
                <div className='flex space-x-2'>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Export Data</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Choose format</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => exportData('json')}>JSON</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportData('csv')}>CSV</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        onClick={summarizeMessages}
                        className="bg-black hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center space-x-2"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <MessageSquare className="w-5 h-5" />
                        )}
                        <span>Summarise Messages</span>
                    </Button>
                </div>

            </div>
            {summary && (
                <div className="my-8 p-4 bg-gray-100 rounded-md relative">
                    <h2 className="text-lg font-semibold mb-2">Summary</h2>
                    <p>{summary}</p>
                    <button
                        onClick={clearSummary}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Close summary"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeMessages.length > 0 ? (
                    activeMessages.map((message) => (
                        <MessageCard
                            key={message._id}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 col-span-2 text-center py-8">No messages to display.</p>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;