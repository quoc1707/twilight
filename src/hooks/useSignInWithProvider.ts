import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

export const useSignInWithProvider = (provider: any, type: string) => {
    signInWithPopup(auth, provider).then(async (result) => {
        const { user } = result

        // Check if user info is already stored in Firestore before
        let isStored = false
        const querySnapshot = await getDocs(collection(db, 'users'))
        let token

        querySnapshot.forEach((doc) => {
            if (doc.id === user.uid) isStored = true
        })

        if (isStored) return

        if (type === 'facebook') {
            const credential = FacebookAuthProvider.credentialFromResult(result)
            token = credential?.accessToken
        }

        setDoc(doc(db, 'users', user.uid), {
            firstName: user.displayName,
            lastName: '',
            ...(type === 'google' && { photoUrl: user.photoURL }),
            ...(type === 'facebook' && {
                photoUrl: user.photoURL + '?access_token=' + token,
            }),
            bookmarks: [],
            recentlyWatch: [],
            ...(type === 'facebook' && { token }),
        })
    })
}
