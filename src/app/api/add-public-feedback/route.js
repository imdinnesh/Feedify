import dbConnect from "@/lib/dbConnect";
import PublicFeedbackModel from "@/models/PublicFeedback";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request) {
    const session = await getServerSession(authOptions);
    await dbConnect();
    if(!session.user) {
        return Response.json({message:'Unauthorized', success:false}, 
            {status:401});
    }

    const {username, space_name, publicfeedback} = await request.json();

    try{
        const existingFeedback=await PublicFeedbackModel.findOne({username, space_name});
        if(!existingFeedback){
            const newFeedback=new PublicFeedbackModel({username, space_name, public_feedbacks:[publicfeedback]});
            await newFeedback.save();
            return Response.json({message:'Public feedback added successfully', success:true}, {status:200});
        }
        else{
            existingFeedback.public_feedbacks.push(publicfeedback);
            await existingFeedback.save();
            return Response.json({message:'Public feedback added successfully', success:true}, {status:200});
        }
    }
    catch(error){
        return Response.json({message:'Internal server error', success:false}, {status:500});
    }

}
