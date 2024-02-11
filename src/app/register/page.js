"use client"
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
export default function Register() {
    const router = useRouter();
    const {data: session, status} = useSession()

    const {
        setError,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()


    const onSubmit = async (data) => {
        const rawResponse = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        if(rawResponse.ok) {
            toast.success("Votre compte a bien été créé");
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        }else{
            const json = await rawResponse.json()
            setError("email", {"message": json?.detail ?? "Oops! Impossible de créer un compte", "type": "error"})
        }
    }

    if(status === "loading") {
        return null;
    }

    if(status === "authenticated") {
        router.push('/')
    }

    return(
        <div className="flex items-center justify-center grow">
            <div className="bg-white p-8 rounded shadow-md max-w-md w-full mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Inscription</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-4">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Pseudo</label>
                        <input {...register('name')} type="text" id="name" name="name" className="mt-1 p-2 w-full border rounded-md" />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
                        <input {...register('email')} type="email" id="email" name="email" className="mt-1 p-2 w-full border rounded-md" />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <input {...register('password')} type="password" id="password" name="password" className="mt-1 p-2 w-full border rounded-md" />
                    </div>

                    <div className="mt-6">
                        <button type="submit" className="w-full p-3 bg-primary text-white rounded-md hover:bg-secondary">S'inscrire</button>
                    </div>
                </form>
            </div>
        </div>
    )
}