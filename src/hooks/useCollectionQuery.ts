import {
    CollectionReference,
    DocumentData,
    Query,
    QuerySnapshot,
    onSnapshot,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

const useCollectionQuery: (
    id: number | string | undefined,
    collection: CollectionReference | Query<DocumentData>
) => {
    isLoading: boolean
    isError: boolean
    data: QuerySnapshot<DocumentData> | null
} = (id, collection) => {
    const [data, setData] = useState<QuerySnapshot<DocumentData> | null>(null)
    const [isLoading, setIsLoading] = useState(!Boolean(data))
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection,
            (querySnapshot) => {
                setData(querySnapshot)
                setIsLoading(false)
                setIsError(false)
            },
            (_error) => {
                setData(null)
                setIsLoading(false)
                setIsError(true)
            }
        )
        return () => unsubscribe()
    }, [id])

    return { isLoading, isError, data }
}

export default useCollectionQuery
