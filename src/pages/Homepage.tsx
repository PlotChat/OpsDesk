import { Button } from "@/components/ui/button";
import { useSignOut } from "@/features/authentication/hooks/useAuth";
import useAuthContext from "@/features/authentication/hooks/useAuthContext";
import type { UserProfile } from "@/features/authentication/types/ProfileType";
import { useNavigate } from "react-router";

const Homepage = () => {
	const navigate = useNavigate();
	const { user, userProfile, isLoading, isError } = useAuthContext();
	const { signOut } = useSignOut();

	const renderAuthorizedLinks = (role: UserProfile["role_name"]) => {
		const cleanRole = role.trim().toLowerCase();
		
		if (cleanRole === "admin" || cleanRole === "staff") {
			return <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>;
		} else if (cleanRole === "customer") {
			return <Button onClick={() => navigate("/home")}>Home</Button>;
		}
	};

	return (
		<main className="p-20">
			<div className="text-3xl mb-10">Home</div>
			{!user && (
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => navigate("/auth/signin")}>
						Sign in
					</Button>
					<Button variant="outline" onClick={() => navigate("/auth/signup")}>
						Sign up
					</Button>
				</div>
			)}

			{user && (
				<div>
					{userProfile &&
						<div className="flex items-center gap-2">
							<h1>Welcome user {userProfile.full_name}</h1>
                            <Button variant={"outline"} onClick={() => navigate("/profile")}>
                                Profile
                            </Button>
							<Button variant={"outline"} onClick={() => signOut()}>
								Sign out
							</Button>
						</div>}
					
                    {isError && (
						<div className="text-red-500">Error loading your profile</div>
                    )}

					{userProfile && <div className="mt-3">{renderAuthorizedLinks(userProfile.role_name)}</div>}
				</div>
			)}
		</main>
	);
};

export default Homepage;
