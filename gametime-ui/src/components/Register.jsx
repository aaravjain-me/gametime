import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import ToolTip from "./ToolTip";
import backendEndpoint from "../hooks/useBackendEndpoint";
import filterUsername from "../hooks/useFilterUsername";
import isEmail from "validator/lib/isEmail";
import moment from 'moment';
import useGetSeconds from "../hooks/useGetSeconds";
import '../styles/Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        dob: null,
        accountType: "",
        username: ""
    });
    const passwordRef = useRef(null);
    const verificationRef = useRef(null);
    const navigate = useNavigate();

    const [showHide, setShowHide] = useState("Hide");
    const [type, setType] = useState("password");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);
    const [verificationCode, setVerificationCode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [seconds, setSeconds] = useState(null);
    const [ver, load] = useState(false);

    // Custom hook to countdown from 500 seconds
    const countdown = useGetSeconds(500);

    useEffect(() => {
        if (formData.username) {
            const timeoutId = setTimeout(async () => {
                const result = await filterUsername(formData.username);
                setMessage(result);
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [formData.username]);

    useEffect(() => {
        if (formSubmitted && !isLoading) {
            if (countdown === 0) {
                load(false)
                setFormSubmitted(false)
                alert("Verification failed, please try again.")
            }
            setSeconds(countdown);
        }
    }, [formSubmitted, isLoading, countdown]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handlePasswordVisibilityChange = () => {
        const passwordField = passwordRef.current;
        const start = passwordField.selectionStart;
        const end = passwordField.selectionEnd;
        setShowHide((prev) => (prev === "Show" ? "Hide" : "Show"));
        setType((prev) => (prev === "password" ? "text" : "password"));
        setTimeout(() => {
            passwordField.focus();
            passwordField.setSelectionRange(start, end);
        }, 0);
    };

    const generateVerificationCode = useCallback((length) => {
        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    }, []);

    const handleDobChange = (date) => {
        setFormData((prevData) => ({ ...prevData, dob: date }));
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasNumber = /\d/;
        const hasUpperCase = /[A-Z]/;
        const hasLowerCase = /[a-z]/;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
        return (
            password.length >= minLength &&
            hasNumber.test(password) &&
            hasUpperCase.test(password) &&
            hasLowerCase.test(password) &&
            hasSpecialChar.test(password)
        );
    };

    const calculateAge = useCallback((dob) => {
        const diffMs = Date.now() - dob.getTime();
        const ageDt = new Date(diffMs);
        return Math.abs(ageDt.getUTCFullYear() - 1970);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const { email, password, dob, accountType, username } = formData;
        if (message === "Proceed, username is available") {
            if (!isEmail(email)) {
                setError("Please enter a valid email address");
                return;
            }

            if (!validatePassword(password)) {
                setError("Password must be at least 8 characters long and include a number, an uppercase letter, a lowercase letter, and a special character.");
                return;
            }

            const code = generateVerificationCode(6);
            const dobValue = dob ? moment(dob).format('YYYY-MM-DD') : '';

            setIsLoading(true);
            setFormSubmitted(true);
            setVerificationCode(code);

            try {
                await backendEndpoint("http://localhost:5000/post/code", {
                    code,
                    username,
                    email
                }, 'post');
                setIsLoading(false);
            } catch (error) {
                setError("Failed to send verification email. Please try again");
                setIsLoading(false);
            }
        }
    };

    const verifyCode = async () => {
        const code = verificationRef.current.value;
        if (verificationCode === code) {
            load(true);
            try {
                await backendEndpoint("http://localhost:5000/post/register", {
                    formData: formData
                })
            } catch (error) {
                load(false)
                setFormSubmitted(false)
                alert("Verification failed, please try again.")
            }
            load(false);
            navigate("/message", { state: { username: formData.username } });
        } else {
            alert("Verification failed, please try again.");
            setFormSubmitted(false);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        <label htmlFor="email">Enter your E-Mail address:</label>
                        <br />
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <br />
                        <input
                            type={type}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            ref={passwordRef}
                            required
                        />
                        <br />
                        <button type="button" onClick={handlePasswordVisibilityChange}>
                            {showHide} password
                        </button>
                    </div>
                    <div>
                        <label htmlFor="dob">Date of Birth:</label>
                        <br />
                        <DatePicker
                            selected={formData.dob}
                            onChange={handleDobChange}
                            dateFormat="MMMM d, yyyy"
                            placeholderText="Select your date of birth"
                            maxDate={new Date()}
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={100}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="type">Select account type:</label>
                        <div className="selection">
                            <select
                                id="type"
                                name="accountType"
                                value={formData.accountType}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled>Select an option</option>
                                <ToolTip message="Public: You can play with anyone and the computer">
                                    <option value="Public">Public</option>
                                </ToolTip>
                                <ToolTip message="Private: You can play with only the computer">
                                    <option value="Private">Private</option>
                                </ToolTip>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <br />
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                        <br />
                        <span>{message}</span>
                    </div>
                    <div>
                        <button type="submit" disabled={isLoading}>{isLoading ? "Confirming" : "Confirm"}</button>
                    </div>
                    {error && <div className="error">{error}</div>}
                </div>
            </form>
            {formSubmitted && !isLoading && (
                <div>
                    <p>Sent verification email, please check your inbox.</p>
                    <p>Time remaining: {seconds} seconds</p>
                    <label htmlFor="verification">Verification code</label>
                    <br />
                    <input
                        type="text"
                        id="verification"
                        name="verification"
                        ref={verificationRef}
                    />
                    <br />
                    <button onClick={verifyCode}>{ver ? "Creating account ..." : "Create account"}</button>
                </div>
            )}
        </div>
    );
}

export default Register;
