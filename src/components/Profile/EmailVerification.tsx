import { sendEmailVerification } from 'firebase/auth'
import { FC } from 'react'
import { toast } from 'react-toastify'
import { getErrorMessage } from '../../helpers'
import { auth } from '../../lib/firebase'
import { useAppSelector } from '../../store/hooks'

const EmailVerification: FC<{
    setIsUpdating: any
}> = ({ setIsUpdating }) => {
    const currentUser = useAppSelector((state) => state.auth.user)
    const firebaseUser = auth.currentUser

    const sendVerificationEmail = () => {
        setIsUpdating(true)
        // @ts-ignore
        sendEmailVerification(firebaseUser)
            .catch((error) => toast.dark(getErrorMessage(error.code)))
            .finally(() => setIsUpdating(false))
    }
    return (
        <>
            {currentUser?.emailVerified ? (
                <span>verified</span>
            ) : (
                <span
                    onClick={sendVerificationEmail}
                    className='text-primary underline'
                >
                    not verified
                </span>
            )}
        </>
    )
}

export default EmailVerification
