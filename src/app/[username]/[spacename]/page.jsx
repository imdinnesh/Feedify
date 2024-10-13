'use client';

import React, { useState } from 'react';
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

const specialChar = '||';

const suggestedMessages = [
    "What's your favorite movie?",
    "Do you have any pets?",
    "What's your dream job?"
];

export default function SendMessage() {
    const params = useParams();
    const { username } = params;
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(messageSchema),
        defaultValues: { content: '' }
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast({
                title: "Message sent successfully!",
                description: "Your anonymous message has been delivered.",
                variant: 'default',
            });
            form.reset();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center text-primary">Send Anonymous Message</h1>
                    <p className="text-center text-muted-foreground">to @{username}</p>
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
                                {suggestedMessages.map((msg, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => form.setValue('content', msg)}
                                        className="text-xs"
                                    >
                                        {msg}
                                    </Button>
                                ))}
                            </div>
                        </form>
                    </Form>
                </CardContent>
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