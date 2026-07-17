import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

/**
 * BackButton — a consistent, styled back navigation button.
 * Props:
 *   to        : (optional) explicit path to navigate to. If not given, navigates -1 (browser history back).
 *   label     : (optional) button label text.  Default: "Back"
 *   className : (optional) extra Tailwind classes.
 */
const BackButton = ({ to, label = "Back", className = "" }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
                text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900
                transition-all duration-150 group ${className}`}
        >
            <ArrowLeft className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5" />
            {label}
        </button>
    );
};

export default BackButton;
