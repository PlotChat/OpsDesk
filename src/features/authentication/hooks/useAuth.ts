import { useMutation } from "@tanstack/react-query";
import { signIn, signOut, signUp } from "../api/authenticate";

export function useSignIn() {
	const signinMutation = useMutation({
		mutationFn: signIn,
	});

	return { signin: signinMutation.mutate, user: signinMutation.data?.user, ...signinMutation };
}

export function useSignUp() {
	const signupMutation = useMutation({
		mutationFn: signUp,
	});

	return { signup: signupMutation.mutate, user: signupMutation.data?.user, ...signupMutation };
}

export function useSignOut() {
	const signoutMutation = useMutation({
		mutationFn: signOut,
	});

	return { signOut: signoutMutation.mutate, ...signoutMutation };
}
