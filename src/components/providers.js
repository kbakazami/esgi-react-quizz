import { ToastContainer } from 'react-toastify';
const Providers = ({children}) => {
    return (
        <>
            {children}
            <ToastContainer />
        </>
    );
}

export default Providers;