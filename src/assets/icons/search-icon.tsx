type Props = {
    className?: string,
}

export default function SearchIcon({ className }: Props) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256" width="48px" height="48px" fillRule="nonzero">
            <g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" >
                <g transform="scale(10.66667,10.66667)">
                    <path d="M21.414,18.586c-0.287,-0.287 -1.942,-1.942 -2.801,-2.801c-0.719,1.142 -1.686,2.109 -2.828,2.828c0.859,0.859 2.514,2.514 2.801,2.801c0.781,0.781 2.047,0.781 2.828,0c0.781,-0.781 0.781,-2.047 0,-2.828z"></path>
                    <circle cx="11" cy="11" r="9" opacity="0.35"></circle>
                </g>
            </g>
        </svg>
    )
}