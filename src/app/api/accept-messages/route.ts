import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";

export async function POST(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json(
        {
            success: false,
            message:"Not Authenticated"
        },
        {
            status: 401
        })
    }

    const userId = user._id;
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            {isAcceptingMessage: acceptMessages},
            {new:true}
        )
        if(!updatedUser){
            return Response.json(
                {
                    success: false,
                    message:"Failed to Update User status to accept Messages"
                },
                {
                    status: 401
                })
        }

        return Response.json(
            {
                success: true,
                message:"Message Acceptance status updated successfully",
                updatedUser
            },
            {
                status: 401
            })
        
    } catch (error) {
        console.log("Failed to Update User status to accept Messages")
        return Response.json(
            {
                success: false,
                message:"Failed to Update User status to accept Messages"
            },
            {
                status: 500
            })
    }

    







}

export async function GET(request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json(
        {
            success: false,
            message:"Not Authenticated"
        },
        {
            status: 401
        })
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser){
            return Response.json(
            {
                success: false,
                message:"User not found"
            },
            {
                status: 401
            })
        }
    
        
            return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages
            },
            {
                status: 200
            })
    } catch (error) {
        console.log("Error in getting message acceptance status")
        return Response.json(
            {
                success: false,
                message:"Error in getting message acceptance status"
            },
            {
                status: 500
            })
    }


}