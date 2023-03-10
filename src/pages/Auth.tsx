import SignIn from '../components/Auth/SignIn'
import SignUp from '../components/Auth/SignUp'
import Title from '../components/Common/Title'
import { useState } from 'react'

const Auth = () => {
    const [isSignIn, setIsSignIn] = useState(true)
    return (
        <>
            <Title value='Sign In' />
            <div className='min-h-screen bg-dark md:bg-black/80'>
                {isSignIn ? (
                    <SignIn setIsSignIn={setIsSignIn} isSignIn={isSignIn} />
                ) : (
                    <SignUp setIsSignIn={setIsSignIn} isSignIn={isSignIn} />
                )}
            </div>
        </>
    )
}

export default Auth
