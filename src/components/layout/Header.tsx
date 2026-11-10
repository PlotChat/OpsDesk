import { useNavigate } from "react-router";
import icon from "@/assets/logo.svg";
import fallbackPfp from "@/assets/fallbackPfp.png";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useAuthContext from "@/features/authentication/hooks/useAuthContext";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/features/authentication/hooks/useAuth";

const Header = () => {
	const navigate = useNavigate();
	const { user } = useAuthContext();
	const { signOut } = useSignOut();

	return (
		<header className="sticky top-0 left-0">
			<nav
				className="
            [ flex items-center justify-between ]
            [ w-full ]
            [ h-12 ps-2.5 pe-5 ] 
            [ bg-popover text-popover-foreground border-b border-b-secondary ]
        "
			>
				{/* Left section */}
				<section className="flex gap-2">
					<button className="flex items-center" onClick={() => navigate("/")}>
						<img src={icon} className="size-6"></img>
					</button>
				</section>

				{/* Right section */}
				<section className="flex items-center gap-2">
					{user ? (
						<>
							<button>
								<Avatar>
									<AvatarImage src={fallbackPfp}></AvatarImage>
									<AvatarFallback></AvatarFallback>
								</Avatar>
							</button>
							<Button variant="outline" onClick={() => signOut()}>
								Sign out
							</Button>
						</>
					) : (
						<>
							<Button variant="outline" onClick={() => navigate("/auth/signin")}>
								Sign in
							</Button>
						</>
					)}
				</section>
			</nav>
		</header>
	);
};
export default Header;
