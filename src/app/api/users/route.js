import prisma from '@/db/db';
import {NextResponse} from "next/server";
import {hashPassword} from "@/utils/password";

export async function POST(req) {
    const data = await req.json();
    const userCount = await prisma.user.count({
        where: {
            email: data.email
        }
    })

    if(userCount > 0) {
        return NextResponse.json({"detail": "Email is already register", "error": true}, {status: 400})
    }

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashPassword(data.password)
        }
    })

    if(!user){
        return NextResponse.json({"detail": "enable to create user account.", "error": true}, {status: 400})
    }

    const responseUser = {
        name: user.name,
        id: user.id,
        email: user.email
    }

    return NextResponse.json(responseUser, {status: 201})
}