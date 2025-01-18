'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { verifySchema } from '@/schemes/verifySchema';

export default function VerifyAccount() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(verifySchema),
    });


    //Getting code from the server
    // const [code, setCode] = useState('');
    // useEffect(() => {
    //     const fetchCode = async () => {
    //         try {
    //             const lastPathSegment = window.location.pathname.split('/').filter(Boolean).pop();
    //             const response = await axios.get(`/api/verify-code/${lastPathSegment}`);
    //             setCode(response.data.code);
    //         } catch (error) {
    //             const axiosError = error;
    //             toast({
    //                 title: 'Error',
    //                 description:
    //                     axiosError.response?.data.message ??
    //                     'An error occurred. Please try again.',
    //                 variant: 'destructive',
    //             });
    //         }
    //     };
    //     fetchCode();
    // }, [])


    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            });

            toast({
                title: 'Success',
                description: response.data.message,
            });

            router.replace('/sign-in');
        } catch (error) {
            const axiosError = error;
            toast({
                title: 'Verification Failed',
                description:
                    axiosError.response?.data.message ??
                    'An error occurred. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                {/* Veification Code */}
                {/* <div className="flex flex-col items-center justify-center bg-gray-100">
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
                        <h2 className="text-xl font-semibold mb-4">Verification Code</h2>
                        <p className="mb-4 text-lg text-blue-600 font-mono">{code}</p>
                        <p className="mb-4 text-sm text-gray-600">
                            In actual production, codes will be sent through email or SMS.
                        </p>
                    </div>
                </div> */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <Input {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Verify</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}