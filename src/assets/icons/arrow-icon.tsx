import clsx from "clsx";

type Props = {
    className?: string,
    onClick: () => void,
}

export default function ArrowIcon({ className, onClick }: Props) {
    return (
        <svg onClick={onClick} className={clsx('', className)} xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
            <path fill="#fff" d="m5 6l5 5l5-5l2 1l-7 7l-7-7z"></path>
        </svg>
    )
}