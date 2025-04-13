'use client'

import React from "react"
import Image from "next/image";
import styles from "./styles.module.css";
import Link from "next/link";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faThreads } from "@fortawesome/free-brands-svg-icons";
import { useEffect } from "react";

const API_URL = 'https://ncapi.dns-dynamic.net';
const request = axios.create({
  baseURL: API_URL,
});
const fetchData = async () => {
  try {
    //Try to get menu by calling "/get-menu" endpoint
    const response = await request.get("/get-menu");
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      // Not an error, just no menu
      return null;
    }
    throw err; // Re-throw for the outer catch to handle
  }
};

export default function Home() {
  useEffect(() => {
    const header = document.querySelector(`.${styles.header}`) as HTMLElement | null;
    if (!header) return; // Safety check
    const scrollHandler = () => {
      if (window.scrollY > 50) {
        header.classList.add(styles.scrolled);
      } else {
        header.classList.remove(styles.scrolled);
      }
    };

    window.addEventListener('scroll', scrollHandler);

    const menuItems = document.getElementById('menuItems') as HTMLElement | null;
    if (!menuItems) return; // Safety check
    const menuConfig = fetchData();
    menuConfig.then((data) => {
      if (data) {
        data.forEach((item: { id: number; name: string; description: string; price: number }) => {
          const menuItem = document.createElement('div');
          menuItem.className = styles.menuItem;
          menuItem.innerHTML = `
            <div className=${styles.menuItem}>
              <h3 className=${styles.menuItemTitle}>${item.name}</h3>
              <p className={styles.menuItemDescription}>${item.description}</p>
              <p className=${styles.menuItemPrice}>${item.price}</p>
            </div>
          `;
          menuItems.appendChild(menuItem);
        });
      }
    })


    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          113 Stand
        </h1>
        <nav className={styles.actions}>
          <Link href="#about">About</Link>
          <Link href="#menu">Menu</Link>
          <Link href="#welcome">Welcome</Link>
          <Link href="#contact">Contact</Link>
          <Link href="/display">叫號系統</Link>
        </nav>
      </header>
      <section className={styles.intro} id="intro">
        <div className={styles.introText}>
          <h2 className={styles.introTitle}>Welcome to 113 Stand</h2>
          <div className={styles.introDescription}>
            <p>113 Stand is a place where you can enjoy delicious food and drinks.</p>
            <p>We offer a wide variety of dishes made with fresh ingredients.</p>
          </div>
          <Link href="#menu" className={styles.introLink}>
            <button className={styles.introButton}>
              View Menu
              <FontAwesomeIcon icon={faArrowRight} fixedWidth className={styles.introButtonIcon} />
            </button>
          </Link>
        </div>
        <Image
          src='/images/welcome.svg'
          alt="Welcome to 113 Stand"
          width={500}
          height={100}
          className={styles.introImage}
          priority
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
        <div className={styles.menuItems} id="menuItems"></div>
      </section>
      <section className={styles.welcome} id="welcome">
        <Image
          src='/images/welcome.png'
          alt="Welcome to 113 Stand"
          width={500}
          height={100}
          className={styles.welcomeImage}
        />
        <div className={styles.welcomeText}>
          <h2 className={styles.welcomeTitle}>Welcome to 113 Stand</h2>
          <div className={styles.welcomeDescription}>
            <p>We are excited to have you here!</p>
            <p>Join us for a meal and experience the best of 113 Stand.</p>
          </div>
        </div>
      </section>
      <section className={styles.contact} id="contact">
        <h2 className={styles.contactTitle}>Contact Us</h2>
        <div className={styles.contactInfo}>
          <a href='https://www.instagram.com/tcfsh113_13/' className={styles.contactItem}>
            <button className={styles.contactButton}>
              <FontAwesomeIcon icon={faInstagram} fixedWidth className={styles.contactIcon} />
              <span className={styles.contactText}>@tcfsh113_13</span>
            </button>
          </a>
          <a href="https://www.threads.net/@tcfsh113_13" className={styles.contactItem}>
            <button className={styles.contactButtonTreads}>
              <FontAwesomeIcon icon={faThreads} fixedWidth className={styles.contactIcon} />
              <span className={styles.contactText}>@tcfsh113_13</span>
            </button>
          </a>
        </div>
      </section>
      <footer className={styles.footer}>
        <div className={styles.footerText}>
          <p>&copy; 2025 113 Stand. All rights reserved.</p>
        </div>
      </footer>
    </main>

  );
}
