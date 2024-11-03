'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { 
    Loader2, RefreshCcw, Copy, PlusCircle, MessageSquare, X, 
    Settings, ChevronDown, Layout, Download, Bell, Grid, Users,
    LineChart, Share2, Sparkles
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemes/acceptSchema';
import { Card, CardContent } from '@/components/ui/card';
import { CreateSpaceSchema } from '@/schemes/createSpaceSchema';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import * as z from "zod";

function UserDashboard() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);

    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const [spacename, setSpaceName] = useState('');
    const [spaces, setSpaces] = useState([]);
    const [activeSpace, setActiveSpace] = useState('')
    const [headingQues, setHeadingQues] = useState('');
    const [summary, setSummary] = useState('');

    const [spaceError, setSpaceError] = useState('');
    const [titleError, setTitleError] = useState('');

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
            // Clear previous errors
            setSpaceError('');
            setTitleError('');

            // Validate the input
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
                // Clear input fields
                setSpaceName('');
                setHeadingQues('');
                // Close the dialog on success
                document.querySelector('[data-dialog-close]')?.click();
            }
        } catch (error) {
            // Handle Zod validation errors
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
            
            // Handle other errors
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
    const profileUrl = `${baseUrl}/public/${username}/${activeSpace}`;

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
        setIsLoading2(true)
        try {
            const response = await axios.post('/api/summarize-messages', {
                messages: activeMessages.map(message => message.content),
            });
            // console.log(response.data.summary);
            setSummary(response.data.summary);
            setIsLoading2(false)
            toast({
                title: 'Summary Generated',
                description: 'Your messages have been summarized.',
                variant: 'success',
            });
        } catch (error) {
            setIsLoading2(false)
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
                {/* Quick Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-gray-200">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-100 text-sm font-medium">Total Messages</p>
                                    <h3 className="text-3xl font-bold mt-1">{activeMessages.length}</h3>
                                </div>
                                <MessageSquare className="h-8 w-8 text-gray-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Active Space</p>
                                    <h3 className="text-xl font-semibold mt-1 text-gray-800">{activeSpace || 'None Selected'}</h3>
                                </div>
                                <Select onValueChange={setActiveSpace}>
                                    <SelectTrigger className="w-[140px] bg-gray-50 border-gray-200 hover:border-gray-400 transition-colors">
                                        <SelectValue placeholder="Switch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {spaces.map((space, key) => (
                                            <SelectItem key={key} value={space}>
                                                {space}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Message Status</p>
                                    <h3 className="text-xl font-semibold mt-1 text-gray-800">
                                        {acceptMessages ? 'Accepting' : 'Paused'}
                                    </h3>
                                </div>
                                <Switch
                                    {...register('acceptMessages')}
                                    checked={acceptMessages}
                                    onCheckedChange={handleSwitchChange}
                                    disabled={isSwitchLoading}
                                    className="data-[state=checked]:bg-gray-600"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Bar */}
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
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-gray-600 hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-gray-200">
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    New Space
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Space</DialogTitle>
                                    <DialogDescription>
                                        Create a dedicated space for collecting messages
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Space Name</Label>
                                        <Input
                                            placeholder="Enter space name"
                                            value={spacename}
                                            onChange={(e) => setSpaceName(e.target.value)}
                                            className={`w-full ${spaceError ? 'border-red-500' : ''}`}
                                        />
                                        {spaceError && (
                                            <p className="text-sm text-red-500 mt-1">{spaceError}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Heading Question</Label>
                                        <Input
                                            placeholder="Enter heading question"
                                            value={headingQues}
                                            onChange={(e) => setHeadingQues(e.target.value)}
                                            className={`w-full ${titleError ? 'border-red-500' : ''}`}
                                        />
                                        {titleError && (
                                            <p className="text-sm text-red-500 mt-1">{titleError}</p>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button onClick={createSpace} className="bg-gray-600 hover:bg-gray-700">
                                            Create Space
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <div className="flex items-center gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="hover:border-gray-400 transition-colors border-gray-200">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                        <ChevronDown className="h-4 w-4 ml-2" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => exportData('json')}>
                                        Export as JSON
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => exportData('csv')}>
                                        Export as CSV
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

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

                {/* Summary Card */}
                {summary && (
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
                )}

                {/* Messages Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {activeMessages.length > 0 ? (
                        activeMessages.map((message) => (
                            <MessageCard
                                key={message._id}
                                message={message}
                                onMessageDelete={handleDeleteMessage}
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