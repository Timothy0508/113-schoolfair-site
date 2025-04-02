'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const API_URL = 'https://my-call-queue-worker.timothytseng508.workers.dev';
const request = axios.create({ baseURL: API_URL });

export default function DisplayPage() {
    const [currentNumber, setCurrentNumber] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userNumber, setUsersNumber] = useState<string | null>(null);

    // Fetch current number
    const fetchCurrentNumber = async () => {
        try {
            const response = await request.get("/current");
            setCurrentNumber(response.data.current_number);
            setError(null);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setCurrentNumber(null);
            } else {
                setError("無法連接到服務器");
            }
        }
    };

    const getUsersNumber = () => {
        const url = window.location.search.substring(1);
        const urlVars = url.split('&');
        for (let i = 0; i < urlVars.length; i++) {
            const parameter = urlVars[i].split('=');
            if (parameter[0] === 'number') {
                setUsersNumber(parameter[1]);
            }
        }
    }

    // Fetch data initially and set up interval to refresh
    useEffect(() => {
        fetchCurrentNumber();
        getUsersNumber();

        // Set up interval to refresh data every 3 seconds
        const intervalId = setInterval(fetchCurrentNumber, 3000);

        // Clean up interval when component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={styles.container}>
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

            <div className={styles.displayBox}>
                <h1 className={styles.displayTitle}>您的號碼</h1>

                <div className={styles.userNumberDisplay}>
                    {userNumber !== null ? userNumber : "未提供號碼"}
                </div>
            </div>

            <div className={styles.footer}>
                <p>113 Stand 叫號系統</p>
            </div>
        </div>
    );
}