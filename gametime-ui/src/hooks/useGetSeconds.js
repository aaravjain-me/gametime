import { useEffect, useState } from "react";

function useGetSeconds(seconds) {
    const [currentSecond, setCurrentSecond] = useState(seconds);

    useEffect(() => {
        if (currentSecond === 0) return;

        const interval = setInterval(() => {
            setCurrentSecond(prevSecond => prevSecond - 1);
        }, 1000);

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [currentSecond]);

    return currentSecond;
}

export default useGetSeconds;

