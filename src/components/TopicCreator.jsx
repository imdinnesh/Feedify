"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useMutation } from "@tanstack/react-query"
import { createTopic } from "@/app/(topics)/actions"
import { useToast } from '@/components/ui/use-toast';


const TopicCreator = () => {
    const { toast } = useToast()
    const [input, setInput] = useState("")
    const [error, setError] = useState(null)

    const { mutate,isPending } = useMutation({
        mutationFn: createTopic,
        onSuccess: (data) => {
            if(data.error){
                setError(data.error)
            }
            toast({
                title: "An error occurred.",
                description: data.error,
                status: "error",
                duration: 2000,
                variant: "destructive"
            });
        }

    })

    return (
        <div className="mt-12 flex flex-col gap-2">
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={({ target }) => setInput(target.value)}
                    className="bg-white min-w-64"
                    placeholder="Enter topic here..."
                />
                <Button
                    disabled={isPending}
                    onClick={() => mutate({ topicName: input })}
                >
                    Create
                </Button>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
    )
}

export default TopicCreator