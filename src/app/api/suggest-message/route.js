import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const message = searchParams.get('message');
    if (!message) {
        return NextResponse.json(
            { success: false, message: 'Please provide a message to suggest' },
            { status: 400 }
        );
    }
    try {
        const prompt = `Suggest 3 responses to the following message: ${message} in short words and make it as a possible answer to the question and write the answers write the answers and dont add serial number to the answers and separate the answers with a comma`;
        const result = await model.generateContent(prompt);
        const suggestion =result.response.text();

        // Parse the suggestion text as JSON

        return NextResponse.json(
            { success: true, suggestion },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error suggesting message:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}