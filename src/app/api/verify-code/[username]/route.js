import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
export async function GET(request) {
    await dbConnect();
    const url = new URL(request.url);
    const pathname = url.pathname;
    // console.log(pathname);
    const username = pathname.split('/').filter(Boolean).pop();
    try {
        const user = await UserModel.findOne({ username: username });
        if (!user) {
            return Response.json({
                success: false,
                message: 'User not found'}, 
                { status: 404 }
            )
        }
        else {
            return Response.json({
                success: true,
                message: 'Code received',
                code: user.verifyCode
            }, { status: 200 });
        }
    }
    catch{
        return Response.json({
            success: false,
            message: 'Error receiving code'
        },
            { status: 500 })
    }

    // const decodedUsername = decodeURIComponent(username);
    // const user = await UserModel.findOne({ username: decodedUsername });
    // console.log(user);

    // try {
    //     const code = await UserModel.findOne({ username: _user.username }).select('verifyCode');
    //     return Response.json({
    //         success: true,
    //         message: 'Code received',
    //         code: code
    //     },
    //         { status: 200 })
    // }
    // catch {
    //     return Response.json({
    //         success: false,
    //         message: 'Error receiving code'
    //     },
    //         { status: 500 })
    // }
    return Response.json({ message: 'Not implemented' }, { status: 501 });
}