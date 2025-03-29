import Image from "next/image";
import styles from "./styles.module.css";

export default function Home() {
  return (

    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          113 Stand
        </h1>
        <div className={styles.actions}>
          <a href="#about">About</a>
          <a href="#menu">Menu</a>
          <a href="#welcome">Welcome</a>
          <a href="#contact">Contact</a>
        </div>
      </header>
      <section className={styles.welcome} id="welcome">
        <div className={styles.welcomeText}>
          <h2 className={styles.welcomeTitle}>Welcome to 113 Stand</h2>
          <p>113 Stand is a place where you can enjoy delicious food and drinks.</p>
          <p>We offer a wide variety of dishes made with fresh ingredients.</p>
        </div>
        <Image
          src='/images/welcome.svg'
          alt="Welcome to 113 Stand"
          width={500}
          height={100}
          className={styles.welcomeImage}
        />
      </section>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </main>

  );
}
