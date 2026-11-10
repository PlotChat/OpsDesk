import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignIn } from "../hooks/useAuth";
import { useState } from "react";
import type { AuthProps } from "../api/authenticate";
import { useNavigate } from "react-router";

export const SigninForm = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState<AuthProps["email"]>("");
	const [password, setPassword] = useState<AuthProps["password"]>("");
	const [error, setError] = useState<string>("");

	const { user, signin, isError } = useSignIn();

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				
				setError("");
				signin({ email, password });
				
				if (user) {
					navigate("/");
				} else if (isError){
					setError("Error while signing in. Try again later.");
				}
			}}
		>
			<FieldSet>
				<FieldGroup>
					<FieldLegend>
						<h1>Sign in</h1>
					</FieldLegend>
				</FieldGroup>
				<FieldGroup>
					<span className="text-red-500">{error}</span>
					<Field>
						<FieldLabel htmlFor="signin-email">Email</FieldLabel>
						<Input
							value={email}
							onChange={(e) => setEmail(e.currentTarget.value)}
							id="signin-email"
							type="email"
							placeholder="friend@gmail.com"
							required
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="signin-password">Password</FieldLabel>
						<Input
							value={password}
							onChange={(e) => setPassword(e.currentTarget.value)}
							id="signin-password"
							type="password"
							required
						/>
					</Field>
					<Button type="submit" className="w-full">
						Sign in
					</Button>
				</FieldGroup>
			</FieldSet>
		</form>
	);
};

export const SignupForm = () => {
	return (
		<form>
			<FieldSet>
				<FieldGroup>
					<FieldLegend>
						<h1>Sign up</h1>
					</FieldLegend>
				</FieldGroup>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="signin-email">Email</FieldLabel>
						<Input id="signin-email" type="email" placeholder="friend@gmail.com" required />
					</Field>
					<Field>
						<FieldLabel htmlFor="signin-password">Email</FieldLabel>
						<Input id="signin-password" type="password" required />
					</Field>
					<Button type="submit" className="w-full">
						Sign in
					</Button>
				</FieldGroup>
			</FieldSet>
		</form>
	);
};
