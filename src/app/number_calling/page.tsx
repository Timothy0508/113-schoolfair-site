'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const API_URL = 'https://ncapi.dns-dynamic.net';
const request = axios.create({
    baseURL: API_URL,
    timeout: 5000, // Add timeout to prevent long waiting
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    },
});

export default function NumberCallingPage() {
    const [currentNumber, setCurrentNumber] = useState<number | null>(null);
    const [queue, setQueue] = useState<number[]>([]);
    const [queueLength, setQueueLength] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('disconnected');

    // Fetch current number, queue, and queue length
    const fetchData = async () => {


        try {
            // Try to get current number
            try {
                const currentResponse = await request.get("/current");
                setCurrentNumber(currentResponse.data.current_number);
                setConnectionStatus('connected');
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    // Not an error, just no current number
                    setCurrentNumber(null);
                    setConnectionStatus('connected');
                } else {
                    throw err; // Re-throw for the outer catch to handle
                }
            }

            // Get queue
            const queueResponse = await request.get("/queue");
            setQueue(queueResponse.data.queue);

            // Get queue length
            const lengthResponse = await request.get("/queue/length");
            setQueueLength(lengthResponse.data.length);

            setError(null);
        } catch (err) {
            setConnectionStatus('disconnected');
            console.error("API connection error:", err);
            setError("無法連接到服務器，請確保API服務正在運行並且可訪問");
        }
    };

    // Call next number
    const handleDequeue = async () => {
        try {
            await request.post("/dequeue");
            fetchData(); // Refresh data after dequeue
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setError("目前隊列中沒有人");
            } else {
                console.error("Dequeue error:", err);
                setError("叫號失敗，請重試");
            }
        }
    };

    // Add new number to queue
    const handleEnqueue = async () => {
        try {
            await request.post("/queue");
            fetchData(); // Refresh data after enqueue
        } catch (err) {
            console.error("Enqueue error:", err);
            setError("無法添加新號碼，請重試");
        }
    };

    //Reset
    const handleReset = async () => {
        try {
            await request.post("/reset");
            fetchData();
        } catch (err) {
            console.error("Reset error:", err);
            setError("重置失敗")
        }
    }

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

            <div className={`${styles.statusIndicator} ${connectionStatus === 'connected' ? styles.connected : styles.disconnected}`}>
                {connectionStatus === 'connected' ? '已連接到伺服器' : '未連接到伺服器'}
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.currentNumberContainer}>
                <h2 className={styles.sectionTitle}>目前叫號</h2>
                <div className={styles.currentNumberDisplay}>
                    {(
                        currentNumber !== null ? currentNumber : "無"
                    )}
                </div>
            </div>

            <div className={styles.queueInfoContainer}>
                <h2 className={styles.sectionTitle}>隊列資訊</h2>
                <div className={styles.queueInfo}>
                    {(
                        <>
                            <p>目前隊列中共有: <span className={styles.count}>{queueLength}</span> 位</p>
                            <p>等待號碼: {queue.length > 0 ? queue.join(", ") : "無"}</p>
                        </>
                    )}
                </div>
            </div>

            <div className={styles.troubleshooting}>
                <h3>連接問題？</h3>
                <ul>
                    <li>確保API服務正在運行</li>
                    <li>檢查API服務是否已啟用CORS</li>
                    <li>嘗試刷新頁面或重啟服務</li>
                </ul>
            </div>

            <div className={styles.controls}>
                <button
                    onClick={handleDequeue}
                    className={styles.callButton}
                    disabled={connectionStatus === 'disconnected'}
                >
                    叫下一號
                </button>
                <button
                    onClick={handleEnqueue}
                    className={styles.addButton}
                    disabled={connectionStatus === 'disconnected'}
                >
                    加入新號碼
                </button>
                <button
                    onClick={handleReset}
                    className={styles.resetButton}
                    disabled={connectionStatus === 'disconnected'}
                >
                    重置
                </button>
            </div>
        </div>
    );
}