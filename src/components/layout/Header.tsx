import { useNavigate } from "react-router";
import icon from "../../../public/favicon.svg";
import fallbackPfp from "../../../public/fallbackPfp.png";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Header = () => {
  const navigate = useNavigate();

	return (
    <header>
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
        <section>
          <Avatar>
            <AvatarImage src={fallbackPfp}></AvatarImage>
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </section>
      </nav>
    </header>
	);
};
export default Header;
