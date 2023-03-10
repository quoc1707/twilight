import { FC, ReactNode } from 'react'

import { Navigate } from 'react-router-dom'

const Protected: FC<{
    isSignedIn: boolean
    children: ReactNode
}> = ({ isSignedIn, children }) => {
    return isSignedIn ? <>{children}</> : <Navigate to='/twilight/' replace />
}

export default Protected
