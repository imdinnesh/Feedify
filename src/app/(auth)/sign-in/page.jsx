"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Mail, Lock, User } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signInSchema } from "@/schemes/signInSchema"

export default function SignInForm() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    })

    const onSubmit = async (data) => {
        setIsLoading(true)
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        })

        if (result?.error) {
            setIsLoading(false)
            if (result.error === "CredentialsSignin") {
                toast({
                    title: "Login Failed",
                    description: "Incorrect username or password",
                    variant: "destructive",
                })
            } else {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                })
            }
        }

        if (result?.url) {
            setIsLoading(true)
            router.replace("/dashboard")
        }
    }

    const handleGuest = async () => {
        setIsLoading(true)
        const result = await signIn("credentials", {
            redirect: false,
            identifier: "guest",
            password: "123456",
        })

        if (result?.error) {
            setIsLoading(false)
            if (result.error === "CredentialsSignin") {
                toast({
                    title: "Login Failed",
                    description: "Incorrect username or password",
                    variant: "destructive",
                })
            } else {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                })
            }
        }
        if (result?.url) {
            setIsLoading(true)
            router.replace("/dashboard")
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800 p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl font-extrabold tracking-tight text-center">
                            Welcome Back to Feedify Feedback
                        </CardTitle>
                        <p className="text-center text-gray-600 text-sm">Sign in to create spaces and share your unique link</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    name="identifier"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email/Username</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input {...field} className="pl-10" placeholder="Enter your email or username" />
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="password"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input type="password" {...field} className="pl-10" placeholder="Enter your password" />
                                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button className="w-full" type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing In...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <p className="text-center text-sm text-gray-600">
                            Not a member yet?{" "}
                            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 font-medium">
                                Sign up
                            </Link>
                        </p>
                        <Button variant="outline" className="w-full" onClick={handleGuest} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <User className="mr-2 h-4 w-4" />
                                    Login as Guest
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}

