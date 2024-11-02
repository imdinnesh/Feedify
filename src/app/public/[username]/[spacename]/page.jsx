'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent,CardFooter, Card } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemes/messageSchema';


export default function SendMessage() {
    const params = useParams();
    const { username } = params;
    const {spacename}=params;
    const [isLoading, setIsLoading] = useState(false);
    const [title,setTitle]=useState('');
    const [suggestedMessages, setSuggestedMessages] = useState([]);

    const form = useForm({
        resolver: zodResolver(messageSchema),
        defaultValues: { content: '' }
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.post('/api/send-message', {
                ...data,
                username,
                spacename
            });

            toast({
                title: response.data.message,
                variant: 'default',
            });
            form.reset({ ...form.getValues(), content: '' });
        } catch (error) {
            const axiosError = error;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ?? 'Failed to sent message',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getHeading=async()=>{
        try {
            const response = await axios.get('/api/get-heading', {
                params: {
                    username:username,
                    spacename:spacename
                }
            });
            const data=response.data.data;
            setTitle(data[0].title);
        } catch (error) {
            const axiosError = error;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ?? 'Failed to fetch headings',
                variant: 'destructive',
            });
        }
    }

    const getSuggestedMessages = async () => {
        try {

            const response = await axios.get('/api/suggest-message', {
                params: { message:title }
            });

            const data = response.data;

            const array=data.suggestion.split(',');
            setSuggestedMessages(array);

        } catch (error) {
            const axiosError = error;
            console.log(axiosError);
            return [];
        }
    }

    useEffect(()=>{
        getHeading();

    },[])

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center text-primary">Send Anonymous Message</h1>
                    <p className="text-center text-muted-foreground">to @{username}</p>
                    <Separator />
                    <h2 className="text-lg font-semibold text-center text-primary">{title}</h2>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Message</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Write your anonymous message here..."
                                                className="resize-none h-32"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-wrap gap-2">
                                {suggestedMessages.map((message, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => {
                                            form.setValue('content', message);
                                        }}
                                    >
                                        {message}
                                    </Button>

                                ))}
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <div className="flex flex-wrap"> 
                    <Button className='mx-6 px-4 py-2' onClick={getSuggestedMessages}>Suggest Messages</Button>
                </div>
                <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Button
                        type="submit"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isLoading || !form.watch('content')}
                        className="w-full sm:w-auto"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Message
                            </>
                        )}
                    </Button>
                    <Link href="/sign-up" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Get Your Message Board
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}