'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faRotateRight } from "@fortawesome/free-solid-svg-icons";

const API_URL = 'https://ncapi.dns-dynamic.net'; // Replace with your API URL
const request = axios.create({
    baseURL: API_URL,
    timeout: 3000,
    headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
        'Pragma': 'no-cache',
        'Expires': '0',
        'Accept': 'application/json',
    },
});

export default function DisplayPage() {
    const [currentNumber, setCurrentNumber] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch current number
    const fetchCurrentNumber = async () => {
        const timestamp = Date.now();
        try {
            const response = await request.get(`/current?_=${timestamp}`);
            setCurrentNumber(response.data.current_number);
            setError(null);
            console.log(response.data.current_number)
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setCurrentNumber(null);
            } else {
                setError("無法連接到服務器");
            }
        }
    };

    // Fetch data initially and set up interval to refresh
    useEffect(() => {
        fetchCurrentNumber();

        // Set up interval to refresh data every 3 seconds
        const intervalId = setInterval(fetchCurrentNumber, 3000);

        // Clean up interval when component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => router.push('/')}>
                    <FontAwesomeIcon icon={faHome} className={styles.backIcon} />
                    Go back to home
                </button>
            </header>
            <div className={styles.displayBox}>
                <h1 className={styles.displayTitle}>目前叫號</h1>

                {error ? (
                    <div className={styles.error}>{error}</div>
                ) : (
                    <div className={styles.numberDisplay}>
                        {currentNumber !== null ? currentNumber : "等待中"}
                    </div>
                )}
            </div>
            <div className={styles.buttonBox}>
                <button className={styles.reloadButton} onClick={fetchCurrentNumber}>
                    <FontAwesomeIcon icon={faRotateRight}></FontAwesomeIcon>
                </button>
            </div>

            <div className={styles.footer}>
                <p>I Want to &quot;Eat&quot; That Way 叫號系統</p>
            </div>
        </div>
    );
}