import type { User } from "@supabase/supabase-js";
import { createContext } from "react";
import type { UserProfile } from "../types/ProfileType";

export interface AuthContextType {
	user: User | null;
	userProfile: UserProfile | null;
	setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
