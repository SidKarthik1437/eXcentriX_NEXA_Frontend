import { useEffect, useState } from 'react';

function getVisibilityState() {
    const isHidden = typeof document !== 'undefined' ? document.hidden : false;
    return isHidden ? 'hidden' : 'visible';
}

function usePageVisibility() {
    const [visibilityState, setVisibilityState] = useState(getVisibilityState());

    useEffect(() => {
        const handleVisibilityChange = () => {
            setVisibilityState(getVisibilityState());
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('visibilitychange', handleVisibilityChange);
            return () => {
                window.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        }
    }, []);

    return visibilityState;
}

export {usePageVisibility};