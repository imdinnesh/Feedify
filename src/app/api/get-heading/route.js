// app/api/get-heading/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import HeadingModel from '@/models/Heading';

export async function GET(request) {
    try {
        // Connect to database
        await dbConnect();

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const username = searchParams.get('username');
        const spacename = searchParams.get('spacename');
        console.log(username,spacename);

        // Validate required parameters
        if (!username || !spacename) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Username and spacename are required parameters'
                },
                { status: 400 }
            );
        }

        // Query the database
        const headings = await HeadingModel.find({
            username: username,
            space_name: spacename
        })
            .sort({ createdAt: -1 })
            .exec();

        // Check if headings were found
        if (!headings || headings.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No headings found for the given username and spacename'
                },
                { status: 404 }
            );
        }

        // Return successful response
        return NextResponse.json(
            {
                success: true,
                data: headings
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in GET /api/get-heading:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error occurred while fetching headings'
            },
            { status: 500 }
        );
    }
}