import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';

export async function POST(request) {
    // Connect to the database
    await dbConnect();

    try {
        const { username, space } = await request.json();
        const user = await UserModel.findOne({ username }).exec();

        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: 'User not found' }),
                { status: 404 }
            );
        }

        // Check if the space already exists
        const existingSpace = user.spaces.find(s => s=== `${space}`);
        if (existingSpace) {
            return new Response(
                JSON.stringify({ success: false, message: 'Space already exists' }),
                { status: 400 }
            );
        }

        // Add the new space to the user's spaces array
        const newSpace = `${space}`;
        user.spaces.push(newSpace);
        await user.save();

        return new Response(
            JSON.stringify({ success: true, message: 'New Space Created Successfully' }),
            { status: 201 }
        );
    } 
    catch (error) {
        console.error('Error creating space:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Internal server error' }),
            { status: 500 }
        );
    }
}