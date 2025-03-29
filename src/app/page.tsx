import Image from "next/image";
import styles from "./styles.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export function MenuItem({ title, description }: { title: string; description: string }) {
  return (
    <div className={styles.menuItem}>
      <h3 className={styles.menuItemTitle}>{title}</h3>
      <p className={styles.menuItemDescription}>{description}</p>
    </div>
  );
}

export default function Home() {
  return (

    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          113 Stand
        </h1>
        <div className={styles.actions}>
          <Link href="#about">About</Link>
          <Link href="#menu">Menu</Link>
          <Link href="#welcome">Welcome</Link>
          <Link href="#contact">Contact</Link>
        </div>
      </header>
      <section className={styles.welcome} id="welcome">
        <div className={styles.welcomeText}>
          <h2 className={styles.welcomeTitle}>Welcome to 113 Stand</h2>
          <div className={styles.welcomeDescription}>
            <p>113 Stand is a place where you can enjoy delicious food and drinks.</p>
            <p>We offer a wide variety of dishes made with fresh ingredients.</p>
          </div>
          <Link href="#menu" className={styles.welcomeLink}>
            <button className={styles.welcomeButton}>
              View Menu
              <FontAwesomeIcon icon={faArrowRight} fixedWidth className={styles.welcomeButtonIcon} />
            </button>
          </Link>
        </div>
        <Image
          src='/images/welcome.svg'
          alt="Welcome to 113 Stand"
          width={500}
          height={100}
          className={styles.welcomeImage}
        />
      </section>
      <section className={styles.about} id="about">
        <Image
          src='/images/about.png'
          alt="About 113 Stand"
          width={500}
          height={100}
          className={styles.aboutImage}
        />
        <div className={styles.aboutText}>
          <h2 className={styles.aboutTitle}>About Us</h2>
          <div className={styles.aboutDescription}>
            <p>At 113 Stand, we believe in serving quality food that brings people together.</p>
            <p>Our team is dedicated to providing you with the best dining experience possible.</p>
          </div>
        </div>
      </section>
      <section className={styles.menu} id="menu">
        <h2 className={styles.menuTitle}>Our Menu</h2>
        <div className={styles.menuItems}>
          <MenuItem
            title="Grilled Chicken"
            description="Juicy grilled chicken served with a side of vegetables."
          />
          <MenuItem
            title="Vegetable Salad"
            description="Fresh salad made with seasonal vegetables."
          />
          <MenuItem
            title="Chocolate Cake"
            description="Delicious chocolate cake topped with whipped cream."
          />
        </div>
      </section>
      <footer className={styles.footer}>

      </footer>
    </main>

  );
}
