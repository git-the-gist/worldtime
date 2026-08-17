
import { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
    const [errors, setErrors] = useState([]);

    const addError = (message) => {
        setErrors(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                message,
                timestamp: new Date(),
            }
        ]);
    };

    const clearErrors = () => {
        setErrors([]);
    };

    return (
        <ErrorContext.Provider
            value={{
                errors,
                addError,
                clearErrors
            }}
        >
            {children}
        </ErrorContext.Provider>
    );
}

export function useErrors() {
    return useContext(ErrorContext);
}