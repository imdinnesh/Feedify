import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function GET(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session || !_user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }
    try {
        const userDoc = await UserModel.findOne({ username: _user.username }).select('spaces').exec();

        if (!_user || userDoc.length === 0) {
            return Response.json(
                { message: 'No spaces found', success: false },
                { status: 404 }
            );
        }

        return Response.json(
            { spaces: userDoc.spaces },
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