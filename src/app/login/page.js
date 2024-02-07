"use client"
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';
import {signIn, useSession} from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const {data: session, status} = useSession()

    const {
        setError,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        signIn('credentials', {
            redirect: false,
            name: data.name,
            password: data.password
        }).then(res => {
            if(res.ok) {
                toast.success("Connexion réussie !");
                router.push('/');
            }else{
                setError("email", {"message": res?.error ?? "Impossible de se connecter", type: "error"});
            }
        })
    }

    if(status === "loading") {
        return null;
    }

    if(status === "authenticated") {
        router.push('/')
    }

    return(
        <div className="min-h-screen flex items-center justify-center ">
            <div className="bg-white p-8 rounded shadow-md max-w-md w-full mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Connexion</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-4">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Pseudo</label>
                        <input {...register('name')} type="text" id="name" name="name" className="mt-1 p-2 w-full border rounded-md" />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <input {...register('password')} type="password" id="password" name="password" className="mt-1 p-2 w-full border rounded-md" />
                    </div>

                    <div className="mt-6">
                        <button type="submit" className="w-full p-3 bg-primary text-white rounded-md hover:bg-secondary">Se connecter</button>
                    </div>
                </form>
            </div>
        </div>
    )
}