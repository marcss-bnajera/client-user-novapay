import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

export const AuthPage = () => {
    const [isForgot, setIsForgot] = useState(false);

    return isForgot ? (
        <ForgotPasswordForm onSwitch={() => setIsForgot(false)} />
    ) : (
        <LoginForm onForgot={() => setIsForgot(true)} />
    );
};
