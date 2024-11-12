import dbConnect from "@/lib/dbConnect";
import PublicFeedbackModel from "@/models/PublicFeedback";

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const space_name = searchParams.get('space_name');

    if (!space_name || !username) {
        return Response.json({ message: 'Space name and username are required', success: false }, { status: 400 });
    }

    try {
        const feedbacks = await PublicFeedbackModel.findOne({username, space_name});
        return Response.json({ feedbacks, success: true }, { status: 200 });
    } catch (error) {
        return Response.json({ message: 'Internal server error', success: false }, { status: 500 });
    }
}