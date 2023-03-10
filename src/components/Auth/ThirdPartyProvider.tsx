import { FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth'

import { FaFacebookF } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { useSignInWithProvider } from '../../hooks/useSignInWithProvider'

const ThirdPartyProvider = () => {
    return (
        <div className='mb-8 flex gap-4'>
            <button
                onClick={() =>
                    useSignInWithProvider(new GoogleAuthProvider(), 'google')
                }
                className='tw-flex-center h-12 w-12 rounded-full bg-white transition duration-300 hover:brightness-75'
            >
                <FcGoogle size={25} className='text-primary' />
            </button>
            <button
                onClick={() =>
                    useSignInWithProvider(
                        new FacebookAuthProvider(),
                        'facebook'
                    )
                }
                className='tw-flex-center h-12 w-12 rounded-full bg-white transition duration-300 hover:brightness-75'
            >
                <FaFacebookF size={25} className='text-primary' />
            </button>
        </div>
    )
}

export default ThirdPartyProvider
