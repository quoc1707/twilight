import { FC, useEffect } from 'react'

const Title: FC<{
    value: string
}> = ({ value }) => {
    useEffect(() => {
        document.title = value
    }, [value])
    return <></>
}

export default Title
