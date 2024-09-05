import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useGetSeconds from "../hooks/useGetSeconds";

const Message = () => {
    const countDown = useGetSeconds(5);
    const navigate = useNavigate();
    const location = useLocation();

    const [seconds, setSeconds] = React.useState(countDown);

    React.useEffect(() => {
        if (!countDown || countDown === 0) {
            navigate("/home");
        } else {
            setSeconds(countDown);
        }
    }, [countDown, navigate]);

    return (
        <p>We received your registration request, redirecting to home page in {seconds} seconds</p>
    );
}

export default Message;
