'use client'

import styles from "styles.module.css"
import axios, { AxiosResponse } from "axios"
import { useEffect } from "react";

const url = 'http://127.0.0.1:7000';

const request = axios.create({ baseURL: url });

async function getCurrent() {
    const response: AxiosResponse = await request.get("/current");
    return response
}

export default function Home() {
    useEffect(() => {
        const current_number = document.getElementById("current_number");
        if (!current_number) return;
        current_number.innerHTML = `${getCurrent()}`;
    })

    return (
        <>
            <div id="current_number"></div>
        </>
    )
}