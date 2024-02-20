"use client";
import { ToastContainer } from 'react-toastify';
import {SessionProvider} from "next-auth/react";
const Providers = ({children}) => {
    return (
        <>
            <SessionProvider>
                {children}
                <ToastContainer />
            </SessionProvider>
        </>
    );
}

export default Providers;