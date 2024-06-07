import { redis } from "@/lib/redis"
import ClientPage from "./ClientPage"


const Page = async ({ params }) => {
    const { topic } = params

    // [redis, 3, is, 2, great, 6]
    const initialData = await redis.zrange(
        `room:${topic}`,0,49,{withScores: true,}
    )

    const words = []

    for (let i = 0; i < initialData.length; i++) {
        const [text, value] = initialData.slice(i, i + 2)

        if (typeof text === "string" && typeof value === "number") {
            words.push({ text, value })
        }
    }

    await redis.incr("served-requests")

    return <ClientPage initialData={words} topicName={topic} />
}

export default Page