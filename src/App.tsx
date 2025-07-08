import Navbar from "../component/Navbar";
import Hero from "../component/Hero";
import Skills from "../component/Skills";
import Projects from "../component/Projects";
import Experience from "../component/Experience";
import Certification from "../component/Certi";
import Wave from "../component/Wave"
// import Wave from "../component/Wave";
import "./index.css"

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Skills />
      <Projects />
      <Experience />
      <Certification />
      <Wave />
    </div>
  );
}
