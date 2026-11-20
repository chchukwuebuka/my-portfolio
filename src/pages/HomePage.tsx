import { useEffect } from "react";
import Hero from "../components/Hero";
import Introduction from "../components/Introduction";
import SelectedWork from "../components/SelectedWork";
import Experience from "../components/Experience";
import Capabilities from "../components/Capabilities";
import About from "../components/About";
import Contact from "../components/Contact";
import { portfolioData } from "../data/portfolio";

export const HomePage = () => {
  useEffect(() => {
    document.title = `${portfolioData.profile.fullName} | ${portfolioData.profile.role}`;
  }, []);

  return (
    <main id="main-content">
      <Hero />
      <Introduction />
      <SelectedWork />
      <Experience />
      <Capabilities />
      <About />
      <Contact />
    </main>
  );
};

export default HomePage;
