'use client'

import React, { JSX, useEffect } from "react";
import Image from 'next/image';
import styles from "./styles.module.css";
import Link from 'next/link';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faThreads } from "@fortawesome/free-brands-svg-icons";

const API_URL = 'https://ncapi.dns-dynamic.net';
const request = axios.create({
  baseURL: API_URL,
});

const fetchData = async () => {
  try {
    // 嘗試呼叫 "/get-menu" 端點來獲取菜單
    const response = await request.get("/get-menu");
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      // 這不是錯誤，只是沒有菜單
      return null;
    }
    throw err; // 重新拋出錯誤，讓外部的 catch 處理
  }
};

export default function Home() {
  const [menuItems, setMenuItems] = React.useState<JSX.Element[] | null>(null);
  useEffect(() => {
    const header = document.querySelector(`.${styles.header}`) as HTMLElement | null;
    if (!header) return; // 安全檢查
    const scrollHandler = () => {
      if (window.scrollY > 50) {
        header.classList.add(styles.scrolled);
      } else {
        header.classList.remove(styles.scrolled);
      }
    };

    window.addEventListener('scroll', scrollHandler);

    const menuConfig = fetchData();
    menuConfig.then((data) => {
      setMenuItems(
        data.map((item: { id: number; name: string; description: string; price: number }) => {
          return (
            <div key={item.id} className={styles.menuItem}>
              <div className={styles.menuItemDetails}>
                <h2 className={styles.menuItemTitle}>{item.name}</h2>
                <p className={styles.menuItemDescription}>{item.description}</p>
                <p className={styles.menuItemPrice}>${item.price.toFixed(2)}</p>
              </div>
            </div>
          );
        })
      )
    })

    // 清理事件監聽器
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
          <Link href="#about">關於我們</Link>
          <Link href="#menu">菜單</Link>
          <Link href="#welcome">歡迎</Link>
          <Link href="#contact">聯絡我們</Link>
          <Link href="/display">叫號系統</Link>
        </nav>
      </header>
      <section className={styles.intro} id="intro">
        <div className={styles.introText}>
          <h2 className={styles.introTitle}>歡迎來到 113 Stand</h2>
          <div className={styles.introDescription}>
            <p>113 Stand 是一個您可以享受美味食物和飲品的地方。</p>
            <p>我們提供各種以新鮮食材製成的菜餚。</p>
          </div>
          <Link href="#menu" className={styles.introLink}>
            <button className={styles.introButton}>
              查看菜單
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
          <h2 className={styles.aboutTitle}>關於我們</h2>
          <div className={styles.aboutDescription}>
            <p>在 113 Stand，我們相信提供優質的食物，將人們聚集在一起。</p>
            <p>我們的團隊致力於為您提供最好的用餐體驗。</p>
          </div>
        </div>
      </section>
      <section className={styles.menu} id="menu">
        <h2 className={styles.menuTitle}>我們的菜單</h2>
        <div className={styles.menuItems} id="menuItems">{menuItems}</div>
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
          <h2 className={styles.welcomeTitle}>歡迎來到 113 Stand</h2>
          <div className={styles.welcomeDescription}>
            <p>我們很高興您來到這裡！</p>
            <p>加入我們，享用美食，體驗 113 Stand 的精華。</p>
          </div>
        </div>
      </section>
      <section className={styles.contact} id="contact">
        <h2 className={styles.contactTitle}>聯絡我們</h2>
        <div className={styles.contactInfo}>
          <Link href='https://www.instagram.com/tcfsh113_13/' className={styles.contactItem}>
            <button className={styles.contactButton}>
              <FontAwesomeIcon icon={faInstagram} fixedWidth className={styles.contactIcon} />
              <span className={styles.contactText}>@tcfsh113_13</span>
            </button>
          </Link>
          <Link href="https://www.threads.net/@tcfsh113_13" className={styles.contactItem}>
            <button className={styles.contactButtonTreads}>
              <FontAwesomeIcon icon={faThreads} fixedWidth className={styles.contactIcon} />
              <span className={styles.contactText}>@tcfsh113_13</span>
            </button>
          </Link>
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
