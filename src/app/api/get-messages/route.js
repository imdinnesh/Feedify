import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function GET(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user = session?.user;
    const searchParams = request.nextUrl.searchParams
    const space_name = searchParams.get('space_name')
    console.log(space_name);

    if (!space_name) {
        return Response.json(
            { message: 'Space name is required', success: false },
            { status: 400 }
        );
    }

    if (!session || !_user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }
    const userId = new mongoose.Types.ObjectId(_user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $match: { 'messages.space_name': space_name } },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();

        if (!user || user.length === 0) {
            return Response.json(
                { message: 'No messages found', success: false },
                { status: 404 }
            );
        }

        return Response.json(
            { messages: user[0].messages },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}