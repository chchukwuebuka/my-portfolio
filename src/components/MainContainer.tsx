import { PropsWithChildren, useEffect, useState } from "react";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "../../component/Hero";
import Navbar from "../../component/Navbar";
import SocialIcons from "./SocialIcons";
import Work from "./Work";
import TechStackNew from "./TechStackNew";
import Certifications from "../../component/Certi";
import setSplitText from "./utils/splitText";

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );
  const [isMobile] = useState<boolean>(window.innerWidth <= 768);

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && !isMobile && children}
      <div className="container-main">
        <Landing />
        <Career />
        <Work />
        <TechStackNew />
        <Certifications />
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;
