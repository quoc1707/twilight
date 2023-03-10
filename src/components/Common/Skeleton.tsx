import { FC, HTMLProps, ReactNode } from 'react'

const Skeleton: FC<
    | HTMLProps<HTMLDivElement>
    | {
          className: string
          children: ReactNode
      }
> = ({ className, children, ...others }) => {
    return (
        <div
            className={`${className} animate-pulse rounded-md bg-dark-lighten `}
            {...others}
        >
            {children}
        </div>
    )
}

export default Skeleton
