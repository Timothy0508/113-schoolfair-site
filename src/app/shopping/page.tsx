'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.css";
import React from "react";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

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
        </>
    )
}