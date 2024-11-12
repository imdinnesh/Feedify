'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from "next-auth/react";


export function MessageCard({ message, onMessageDelete, activeSpace }) {
    const { toast } = useToast();
    const { data: session } = useSession();

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete(
                `/api/delete-message/${message._id}`
            );
            toast({
                title: response.data.message,
            });
            onMessageDelete(message._id);

        } catch (error) {
            const axiosError = error;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ?? 'Failed to delete message',
                variant: 'destructive',
            });
        }
    };

    const handlePublicFeedback = async () => {
        if (!session?.user?.username) {
            toast({
                title: 'Error',
                description: 'You must be logged in to add feedback',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await axios.post('/api/add-public-feedback', {
                username: session.user.username,
                space_name: activeSpace,
                publicfeedback: message.content,
            });

            toast({
                title: response.data.message,
            });

        } catch (error) {
            const axiosError = error;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ?? 'Failed to add public feedback',
                variant: 'destructive',
            });
        }
    }


    return (
        <Card className="card-bordered">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{message.content}</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={handlePublicFeedback}>
                            <Heart className="w-5 h-5" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant='destructive'>
                                    <X className="w-5 h-5" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete
                                        this message.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteConfirm}>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
                <div className="text-sm">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </div>
            </CardHeader>
            <CardContent></CardContent>
        </Card>
    );
}