import { useEffect, useState } from 'react'

const useCurrentViewport = () => {
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {
        window.addEventListener('resize', () => setWidth(window.innerWidth))
        return () =>
            window.removeEventListener('resize', () =>
                setWidth(window.innerWidth)
            )
    }, [])

    return { width, isSmallScreen: width < 768 }
}

export default useCurrentViewport
