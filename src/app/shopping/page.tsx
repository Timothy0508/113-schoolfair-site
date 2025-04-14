'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.css";
import React from "react";
import axios from "axios";
import { faArrowRight, faCartShopping, faXmark } from "@fortawesome/free-solid-svg-icons";

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

export default function ShoppingPage() {
    return (
        <>
            <header className={styles.header}>
                <h1 className={styles.title}>113 Stand Pre-order</h1>
                <p className={styles.actions}>
                    <button className={styles.button}>
                        <FontAwesomeIcon icon={faCartShopping} className={styles.buttonIcon} />
                    </button>
                </p>
            </header>
            <section className={styles.menuItems} id="menuItems"></section>
            <section className={styles.menuActions}>
                <button className={styles.menuActionButton}>
                    Clear cart
                    <FontAwesomeIcon icon={faXmark} className={styles.menuActionButtonIcon} />
                </button>
                <button className={styles.menuActionButton}>
                    Checkout
                    <FontAwesomeIcon icon={faArrowRight} className={styles.menuActionButtonIcon} />
                </button>
            </section>
            <footer className={styles.footer}>
                <p className={styles.footerText}>© 2023 113 Stand</p>
            </footer>
        </>
    )
}