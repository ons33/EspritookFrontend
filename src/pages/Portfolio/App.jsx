import styles from "./App.module.css";
import { About } from "./components/About/About";
import { Contact } from "./components/Contact/Contact";
import { Experience } from "./components/Experience/Experience";
import { Hero } from "./components/Hero/Hero";
import { Navbar } from "./components/Navbar/Navbar";
import { Projects } from "./components/Projects/Projects";

function AppP() {
  return (
    <div className={styles.App}>
      <Navbar />
        <div className={styles.content}>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Contact />
        </div>
    </div>
  );
}

export default AppP;
