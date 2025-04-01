'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const API_URL = 'http://127.0.0.1:7000';
const request = axios.create({ baseURL: API_URL });

export default function NumberCallingPage() {
    const [currentNumber, setCurrentNumber] = useState<number | null>(null);
    const [queue, setQueue] = useState<number[]>([]);
    const [queueLength, setQueueLength] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    // Fetch current number, queue, and queue length
    const fetchData = async () => {
        try {
            // Try to get current number
            const currentResponse = await request.get("/current");
            setCurrentNumber(currentResponse.data.current_number);
            setError(null);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setCurrentNumber(null);
            } else {
                setError("無法連接到服務器");
            }
        }

        try {
            // Get queue
            const queueResponse = await request.get("/queue");
            setQueue(queueResponse.data.queue);

            // Get queue length
            const lengthResponse = await request.get("/queue/length");
            setQueueLength(lengthResponse.data.length);
        } catch (err) {
            setError("無法連接到服務器");
        }
    };

    // Call next number
    const handleDequeue = async () => {
        try {
            const response = await request.post("/dequeue");
            setCurrentNumber(response.data.current_number);
            fetchData(); // Refresh data after dequeue
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setError("目前隊列中沒有人");
            } else {
                setError("無法連接到服務器");
            }
        }
    };

    // Add new number to queue
    const handleEnqueue = async () => {
        try {
            await request.post("/queue");
            fetchData(); // Refresh data after enqueue
        } catch (err) {
            setError("無法連接到服務器");
        }
    };

    // Fetch data initially and set up interval to refresh
    useEffect(() => {
        fetchData();

        // Set up interval to refresh data every 5 seconds
        const intervalId = setInterval(fetchData, 5000);

        // Clean up interval when component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>叫號系統</h1>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.currentNumberContainer}>
                <h2 className={styles.sectionTitle}>目前叫號</h2>
                <div className={styles.currentNumberDisplay}>
                    {currentNumber ? currentNumber : "無"}
                </div>
            </div>

            <div className={styles.queueInfoContainer}>
                <h2 className={styles.sectionTitle}>隊列資訊</h2>
                <div className={styles.queueInfo}>
                    <p>目前隊列中共有: <span className={styles.count}>{queueLength}</span> 位</p>
                    <p>等待號碼: {queue.length > 0 ? queue.join(", ") : "無"}</p>
                </div>
            </div>

            <div className={styles.controls}>
                <button onClick={handleDequeue} className={styles.callButton}>
                    叫下一號
                </button>
                <button onClick={handleEnqueue} className={styles.addButton}>
                    加入新號碼
                </button>
            </div>
        </div>
    );
}