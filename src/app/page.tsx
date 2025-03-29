import Image from "next/image";
import styles from "./styles.module.css";
import Link from "next/link";

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
