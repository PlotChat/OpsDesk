import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignIn, useSignUp } from "../hooks/useAuth";
import { useState } from "react";
import type { AuthProps } from "../api/authenticate";
import { useNavigate } from "react-router";
import { cn } from "cn";

const formWrapperStyles = cn("w-120 rounded-2xl border-2 border-muted p-10");

const AUTH_VARIANT_CONFIG = {
    signin: {
        title: "Sign in",
        submitLabel: "Sign in",
        pendingLabel: "Signing in...",
        passwordAutoComplete: "current-password",
        fallbackError: "Error while signing in. Try again later.",
    },
    signup: {
        title: "Sign up",
        submitLabel: "Sign up",
        pendingLabel: "Signing up...",
        passwordAutoComplete: "new-password",
        fallbackError: "Error while signing up. Try again later.",
    },
} as const;

export const AuthForm = ({ variant }: { variant: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const config = AUTH_VARIANT_CONFIG[variant];

    const [email, setEmail] = useState<AuthProps["email"]>("");
    const [password, setPassword] = useState<AuthProps["password"]>("");
    const [error, setError] = useState<string>("");

    const { signin, isPending: isPendingSignIn } = useSignIn();
    const { signup, isPending: isPendingSignUp } = useSignUp();

    const isPending = isPendingSignIn || isPendingSignUp;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const authenticate = variant === "signin" ? signin : signup;

        authenticate(
            { email, password },
            {
                onSuccess: () => navigate("/"),
                onError: (err: Error) => {
                    setError(err instanceof Error ? err.message : config.fallbackError);
                },
            }
        );
    };

    return (
        <div className={formWrapperStyles}>
            <form onSubmit={handleSubmit}>
                <FieldSet>
                    <FieldGroup>
                        <FieldLegend>{config.title}</FieldLegend>
                    </FieldGroup>
                    <FieldGroup>
                        {error && <span className="text-sm text-red-500">{error}</span>}
                        <Field>
                            <FieldLabel htmlFor={`${variant}-email`}>Email</FieldLabel>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                id={`${variant}-email`}
                                type="email"
                                autoComplete="email"
                                placeholder="friend@gmail.com"
                                disabled={isPending}
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor={`${variant}-password`}>Password</FieldLabel>
                            <Input
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                id={`${variant}-password`}
                                type="password"
                                autoComplete={config.passwordAutoComplete}
                                disabled={isPending}
                                required
                            />
                        </Field>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? config.pendingLabel : config.submitLabel}
                        </Button>
                    </FieldGroup>
                </FieldSet>
            </form>
        </div>
    );
};