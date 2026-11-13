import { supabase } from "@/lib/supabase";

export interface AuthProps {
	email: string;
	password: string;
}
export async function signUp({ email, password }: AuthProps) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	});

	if (error) {
		throw new Error(`Error signing up: ${error.message}`);
	}

	return data;
}

export async function signIn({ email, password }: AuthProps) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		throw new Error(`Error signing in: ${error.message}`);
	}

	return data;
}

export async function signOut() {
	const { error } = await supabase.auth.signOut();

	if (error) {
		throw new Error("Error signing up.");
	}

	return true;
}
