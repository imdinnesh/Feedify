"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDebounceCallback } from "usehooks-ts"
import axios from "axios"
import { Loader2, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signUpSchema } from "@/schemes/signUpSchema"

export default function SignUpForm() {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername, 500)

    const router = useRouter()
    const { toast } = useToast()

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage("")
                try {
                    const response = await axios.get(`/api/check-unique-username?username=${username}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error 
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique()
    }, [username])

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post("/api/sign-up", data)

            toast({
                title: "Success",
                description: response.data.message,
            })

            router.replace(`/verify/${username}`)
        } catch (error) {
            console.error("Error during sign-up:", error)

            const axiosError = error

            const errorMessage =
                axiosError.response?.data.message || "There was a problem with your sign-up. Please try again."

            toast({
                title: "Sign Up Failed",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <UserPlus className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-center">Join Feedify</CardTitle>
                    <CardDescription className="text-center">Sign up to start your anonymous adventure</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                name="username"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    className="pr-10"
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                        debounced(e.target.value)
                                                    }}
                                                />
                                                {isCheckingUsername && (
                                                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
                                                )}
                                            </div>
                                        </FormControl>
                                        {!isCheckingUsername && usernameMessage && (
                                            <p
                                                className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"
                                                    }`}
                                            >
                                                {usernameMessage}
                                            </p>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" />
                                        </FormControl>
                                        <p className="text-muted-foreground text-sm">We'll send you a verification code</p>
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
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        <p>
                            Already a member?{" "}
                            <Link href="/sign-in" className="text-blue-600 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

