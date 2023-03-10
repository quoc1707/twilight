import { Route, Routes, useLocation } from 'react-router-dom'
import { auth, db } from './lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import Auth from './pages/Auth'
import Bookmarked from './pages/Bookmarked'
import Error from './pages/Error'
import Explore from './pages/Explore'
import Home from './pages/Home'
import MovieInfo from './pages/Movie/MovieInfo'
import MovieWatch from './pages/Movie/MovieWatch'
import Profile from './pages/Profile'
import Protected from './components/Common/Protected'
import Search from './pages/Search'
import TVInfo from './pages/TV/TVInfo'
import TVWatch from './pages/TV/TVWatch'
import { onAuthStateChanged } from 'firebase/auth'
import { setCurrentUser } from './store/slice/auth'
import { useAppDispatch } from './store/hooks'

function App() {
    const location = useLocation()
    const dispatch = useAppDispatch()
    const [isSignedIn, setIsSignedIn] = useState(
        Number(localStorage.getItem('isSignedIn')) ? true : false
    )

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                dispatch(setCurrentUser(null))
                setIsSignedIn(false)
                localStorage.setItem('isSignedIn', '0')
                return
            }

            setIsSignedIn(true)
            localStorage.setItem('isSignedIn', '1')

            if (user.providerData[0].providerId === 'google.com') {
                onSnapshot(doc(db, 'users', user.uid), (doc) => {
                    dispatch(
                        setCurrentUser({
                            displayName:
                                doc.data()?.lastName +
                                    ' ' +
                                    doc.data()?.firstName || '',
                            email: user.email,
                            emailVerified: user.emailVerified,
                            photoURL: doc.data()?.photoUrl || '',
                            uid: user.uid,
                        })
                    )
                })
            } else if (user.providerData[0].providerId === 'facebook.com') {
                onSnapshot(doc(db, 'users', user.uid), (doc) => {
                    dispatch(
                        setCurrentUser({
                            displayName:
                                doc.data()?.lastName +
                                    ' ' +
                                    doc.data()?.firstName || '',
                            email: user.email,
                            emailVerified: user.emailVerified,
                            photoURL: doc.data()?.photoUrl || '',
                            uid: user.uid,
                        })
                    )
                })
            } else {
                onSnapshot(doc(db, 'users', user.uid), (doc) => {
                    dispatch(
                        setCurrentUser({
                            displayName:
                                doc.data()?.lastName +
                                    ' ' +
                                    doc.data()?.firstName || '',
                            photoURL: doc.data()?.photoUrl || '',
                            email: user.email,
                            emailVerified: user.emailVerified,
                            uid: user.uid,
                        })
                    )
                })
            }
        })
    }, [dispatch])

    useEffect(() => window.scrollTo(0, 0), [location.pathname, location.search])

    return (
        <Routes>
            <Route path='/twilight/' element={<Home />} />
            <Route path='/twilight/movie/:id' element={<MovieInfo />} />
            <Route path='/twilight/tv/:id' element={<TVInfo />} />
            <Route path='/twilight/movie/:id/watch' element={<MovieWatch />} />
            <Route path='/twilight/tv/:id/watch' element={<TVWatch />} />
            <Route path='/twilight/explore' element={<Explore />} />
            <Route path='/twilight/search' element={<Search />} />
            <Route path='/twilight/auth' element={<Auth />} />
            <Route
                path='/twilight/bookmarked'
                element={
                    <Protected isSignedIn={isSignedIn}>
                        <Bookmarked />
                    </Protected>
                }
            />
            <Route
                path='/twilight/profile'
                element={
                    <Protected isSignedIn={isSignedIn}>
                        <Profile />
                    </Protected>
                }
            />
            <Route path='/twilight/*' element={<Error />} />
        </Routes>
    )
}

export default App
