import NextAuth from "next-auth"
import prisma from "@/db/db";
import { verify } from "@/utils/password";
import {PrismaAdapter} from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const user = await prisma.user.findUnique({
                    where: {
                        name: credentials.name
                    }
                })
                if(!user) {
                    throw new Error("Ce compte utilisateur n'existe pas !")
                }

                if(!verify(credentials.password, user.password)){
                    throw new Error("Email ou mot de passe invalide !")
                }
                return {
                    name: user.name,
                    email: user.email,
                    id: user.id
                }

                return null;
            }
        })
    ],
    session: {strategy: "jwt", maxAge: 24 * 60 * 60},
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 60 * 60 * 24 * 30,
        encryption: true
    },
    callbacks: {
        async session({session, user, token}) {
            return session
        },
        async jwt({token, user}) {
            if(user){
                token.user = user
            }
            return token
        }
    }
})

export { handler as GET, handler as POST}