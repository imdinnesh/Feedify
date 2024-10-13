import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function POST(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session || !_user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return Response.json(
            { success: false, message: 'Please provide valid messages to summarize' },
            { status: 400 }
        );
    }

    try {
        
        const prompt = `Summarize the following feedbacks in a concise manner: ${messages.join(' ')}`;
        const result = await model.generateContent(prompt);
        const summary = result.response.text();
        return Response.json({ success: true, summary });
    } catch (error) {
        console.error('Error summarizing messages:', error);
        return Response.json(
            { success: false, message: 'An error occurred while summarizing messages' },
            { status: 500 }
        );
    }
}