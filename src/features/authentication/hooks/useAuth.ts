import { useMutation } from "@tanstack/react-query";
import { signIn, signOut } from "../api/authenticate";

export function useSignIn() {
	const signinMutation = useMutation({
		mutationFn: signIn,
	});

	return { signin: signinMutation.mutate, user: signinMutation.data?.user, ...signinMutation };
}

export function useSignOut() {
	const signoutMutation = useMutation({
		mutationFn: signOut,
	});

	return { signOut: signoutMutation.mutate, ...signoutMutation };
}
