import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState, type ReactNode } from "react";
import { getProfileByUserId } from "../api/getProfiles";
import type { UserProfile } from "../types/ProfileType";
import { AuthContext } from "./AuthContext";

interface AuthContextProviderProps {
	children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const syncUserAndProfile = async (authUser: User | null) => {
		if (!authUser) {
			setUser(null);
			setUserProfile(null);
			setIsLoading(false);
			return;
		}

		setUser(authUser);
		try {
			const profile = await getProfileByUserId({ id: authUser.id });
			setUserProfile(profile);
		} catch {
			setUserProfile(null);
			return;
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		// Get the active session when the app loads
		supabase.auth.getSession().then(({ data: { session } }) => {
			syncUserAndProfile(session?.user ?? null);
		});

		// Listen for auth changes (login, logout, token refresh)
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			syncUserAndProfile(session?.user ?? null);
		});
		// Cleanup the listener when the component unmounts
		return () => subscription.unsubscribe();
	}, []);

	const finalValue = { user, userProfile, setUserProfile, setUser, isLoading };

	return <AuthContext value={finalValue}>{children}</AuthContext>;
};
