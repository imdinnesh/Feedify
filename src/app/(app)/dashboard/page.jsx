'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, ShowerHead } from 'lucide-react';
import { User } from 'next-auth';
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

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function UserDashboard() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [spacename, setSpaceName] = useState('');
    const [spaces, setSpaces] = useState([]);
    const [activeSpace,setActiveSpace]=useState('')


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
            const axiosError = error;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ??
                    'Failed to fetch message settings',
                variant: 'destructive',
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue, toast]);

    const fetchMessages = useCallback(
        async (refresh) => {
            setIsLoading(true);
            setIsSwitchLoading(false);
            try {
                const response = await axios.get('/api/get-messages');
                setMessages(response.data.messages || []);
                if (refresh) {
                    toast({
                        title: 'Refreshed Messages',
                        description: 'Showing latest messages',
                    });
                }
            } catch (error) {
                const axiosError = error;
                toast({
                    title: 'Empty',
                    description:
                        axiosError.response?.data.message ?? 'Failed to fetch messages',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
                setIsSwitchLoading(false);
            }
        },
        [setIsLoading, setMessages, toast]
    );

    // Create a new space
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
            const axiosError = error;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ??
                    'Failed to create a new space',
                variant: 'destructive',
            });
        }
    }

    const getSpaces = useCallback(
        async (refresh) => {
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



        }, [setSpaces, toast,createSpace])

    // Fetch initial state from the server
    useEffect(() => {
        if (!session || !session.user) return;

        fetchMessages();
        getSpaces();
        fetchAcceptMessages();
    }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

    // Handle switch change
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
            const axiosError = error;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ??
                    'Failed to update message settings',
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

    // Export data
    const exportData_csv = async () => {


        if (!session || !session.user) return;

        fetchMessages();


        if (messages.length === 0) {
            toast({
                title: 'No Data',
                description: 'There are no messages to export.',
                variant: 'warning',
            });
            return;
        }

        const csvContent = [
            ['ID', 'Text', 'Date'], // Header row
            ...messages.map((message, idx) => [idx, message.content, dayjs(message.createdAt).format('MMM D, YYYY h:mm A')]) // Data rows
        ]
            .map(e => e.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'messages.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: 'Export Successful',
            description: 'Messages have been exported to CSV.',
            variant: 'success',
        });
    };

    const exportData_json = async () => {
        if (!session || !session.user) return;

        fetchMessages();

        if (messages.length === 0) {
            toast({
                title: 'No Data',
                description: 'There are no messages to export.',
                variant: 'warning',
            });
            return;
        }

        const jsonContent = JSON.stringify(messages, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'messages.json');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: 'Export Successful',
            description: 'Messages have been exported to JSON.',
            variant: 'success',
        });
    };

    const handleSelectvalueChange = (value) => {
        setActiveSpace(value);

    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Create Space</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="space name" className="text-right">
                                Space Name
                            </Label>
                            <Input
                                id="spacename"
                                defaultValue="default"
                                className="col-span-3"
                                type="text"
                                onChange={(e) => setSpaceName(e.target.value)}
                                
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose>
                            <Button type="submit" onClick={createSpace}>Create Space</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div>
                <Select onValueChange={handleSelectvalueChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Choose Space" />
                    </SelectTrigger>
                    <SelectContent>
                        {spaces.map((space,key) => (
                            <SelectItem key={key} value={space}>
                                {space}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Separator className='mt-6' />
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger className='ml-6 px-4 py-2 rounded-md bg-slate-800 text-gray-100'>Export</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Export data as </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={exportData_json}>JSON</DropdownMenuItem>
                    <DropdownMenuItem onClick={exportData_csv}>CSV</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={message._id}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div >
    );
}

export default UserDashboard;