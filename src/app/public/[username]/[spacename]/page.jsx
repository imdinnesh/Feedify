'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, CardFooter, Card } from '@/components/ui/card';
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
import { messageSchema } from '@/schemes/messageSchema';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SendMessage() {
    const params = useParams();
    const { username, spacename } = params;
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [suggestedMessages, setSuggestedMessages] = useState([]);
    const [isSuggesting, setIsSuggesting] = useState(false);

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
                title: "Message sent successfully! 🎉",
                description: "Your anonymous message is on its way.",
                variant: 'default',
            });
            form.reset({ content: '' });
        } catch (error) {
            toast({
                title: 'Failed to send message',
                description: error.response?.data.message ?? 'Please try again later',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getHeading = async () => {
        try {
            const response = await axios.get('/api/get-heading', {
                params: { username, spacename }
            });
            setTitle(response.data.data[0].title);
        } catch (error) {
            toast({
                title: 'Error loading topic',
                description: 'Failed to fetch the message board topic',
                variant: 'destructive',
            });
        }
    };

    const getSuggestedMessages = async () => {
        setIsSuggesting(true);
        try {
            const response = await axios.get('/api/suggest-message', {
                params: { message: title }
            });
            setSuggestedMessages(response.data.suggestion.split(','));
        } catch (error) {
            console.error(error);
            toast({
                title: 'Failed to get suggestions',
                description: 'Please try writing your own message instead',
                variant: 'destructive',
            });
        } finally {
            setIsSuggesting(false);
        }
    };

    useEffect(() => {
        getHeading();
    }, []);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <Card className="w-full max-w-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            Send Anonymous Message
                        </h1>
                        <p className="text-center text-muted-foreground">
                            to <span className="font-semibold text-primary">@{username}</span>
                        </p>
                    </div>
                    <Separator className="my-4" />
                    <div className="bg-primary/5 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold text-center text-primary">
                            {title || 'Loading topic...'}
                        </h2>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg">Your Message</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Share your thoughts anonymously..."
                                                className="resize-none h-32 focus:ring-2 focus:ring-primary/20"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>

                    <div className="space-y-4">
                        <Button
                            onClick={getSuggestedMessages}
                            variant="outline"
                            className="w-full group hover:bg-primary/5"
                            disabled={isSuggesting}
                        >
                            <Sparkles className="mr-2 h-4 w-4 group-hover:text-primary" />
                            {isSuggesting ? 'Getting suggestions...' : 'Need inspiration? Get suggestions'}
                        </Button>

                        {suggestedMessages.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fadeIn">
                                {suggestedMessages.map((message, index) => (
                                    <Button
                                        key={index}
                                        variant="ghost"
                                        className="text-left h-auto py-2 px-3 hover:bg-primary/5"
                                        onClick={() => form.setValue('content', message)}
                                    >
                                        <ArrowRight className="mr-2 h-4 w-4 flex-shrink-0" />
                                        <span className="line-clamp-2">{message}</span>
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
                    <Button
                        type="submit"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isLoading || !form.watch('content')}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90"
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
                        <Button
                            variant="outline"
                            className="w-full group hover:bg-primary/5"
                        >
                            <MessageSquare className="mr-2 h-4 w-4 group-hover:text-primary" />
                            Get Your Message Board
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}