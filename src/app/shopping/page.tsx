'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { faArrowRight, faCartShopping, faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

const API_URL = 'https://ncapi.dns-dynamic.net';
const request = axios.create({
    baseURL: API_URL,
});

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
}

interface CartItem extends MenuItem {
    quantity: number;
}

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
    const [menuData, setMenuData] = useState<MenuItem[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

    useEffect(() => {
        const getMenuData = async () => {
            try {
                const data = await fetchData();
                if (data) {
                    setMenuData(data);
                }
            } catch (error) {
                console.error("Error fetching menu data:", error);
            }
        };

        getMenuData();
    }, []); // Empty dependency array to run only once on mount

    const getItemQuantity = (itemId: number) => {
        const item = cart.find(item => item.id === itemId);
        return item ? item.quantity : 0;
    };

    const increaseQuantity = (item: MenuItem) => {
        setCart(prevCart => {
            const itemInCart = prevCart.find(cartItem => cartItem.id === item.id);

            if (itemInCart) {
                // Update existing item
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                // Add new item
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const decreaseQuantity = (itemId: number) => {
        setCart(prevCart => {
            const itemInCart = prevCart.find(cartItem => cartItem.id === itemId);

            if (!itemInCart) return prevCart;

            if (itemInCart.quantity === 1) {
                // Remove item if quantity becomes 0
                return prevCart.filter(cartItem => cartItem.id !== itemId);
            } else {
                // Decrease quantity
                return prevCart.map(cartItem =>
                    cartItem.id === itemId
                        ? { ...cartItem, quantity: cartItem.quantity - 1 }
                        : cartItem
                );
            }
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const renderMenu = () => {
        if (!menuData.length) {
            return <p>Loading menu items...</p>;
        }

        return menuData.map((item) => (
            <div key={item.id} className={styles.menuItem}>
                <div className={styles.menuItemDetails}>
                    <h2 className={styles.menuItemTitle}>{item.name}</h2>
                    <p className={styles.menuItemDescription}>{item.description}</p>
                    <p className={styles.menuItemPrice}>${item.price.toFixed(2)}</p>
                </div>
                <div className={styles.menuItemActions}>
                    <button
                        className={styles.menuItemActionButton}
                        onClick={() => increaseQuantity(item)}
                    >
                        <FontAwesomeIcon icon={faPlus} className={styles.buttonIcon} />
                    </button>
                    <p className={styles.menuItemQuantity}>{getItemQuantity(item.id)}</p>
                    <button
                        className={styles.menuItemActionButton}
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={getItemQuantity(item.id) === 0}
                    >
                        <FontAwesomeIcon icon={faMinus} className={styles.buttonIcon} />
                    </button>
                </div>
            </div>
        ));
    };

    const handleCheckout = () => {
        if (cart.length > 0) {
            alert(`Proceeding to checkout. Total: $${getTotalPrice().toFixed(2)}`);
            // Further checkout logic would go here
        } else {
            alert("Your cart is empty!");
        }
    };

    return (
        <>
            <header className={styles.header}>
                <h1 className={styles.title}>113 Stand Pre-order</h1>
                <p className={styles.actions}>
                    <button className={styles.button} onClick={() => setIsCartOpen(!isCartOpen)}>
                        <FontAwesomeIcon icon={faCartShopping} className={styles.buttonIcon} />
                        {cart.length > 0 && <span className={styles.cartCount}>{cart.length}</span>}
                    </button>
                </p>
            </header>
            <section className={styles.menuItems} id="menuItems">
                {renderMenu()}
            </section>
            <section className={styles.menuActions}>
                <button
                    className={styles.menuActionButton}
                    onClick={clearCart}
                    disabled={cart.length === 0}
                >
                    Clear cart
                    <FontAwesomeIcon icon={faXmark} className={styles.menuActionButtonIcon} />
                </button>
                <button
                    className={styles.menuActionButton}
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                >
                    Checkout
                    <FontAwesomeIcon icon={faArrowRight} className={styles.menuActionButtonIcon} />
                </button>
            </section>
            {isCartOpen && (
                <div className={styles.cartModal}>
                    <div className={styles.cartContent}>
                        <h2>Your Cart</h2>
                        {cart.length === 0 ? (
                            <p>Your cart is empty.</p>
                        ) : (
                            <>
                                {cart.map(item => (
                                    <div key={item.id} className={styles.cartItem}>
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className={styles.cartTotal}>
                                    <strong>Total: ${getTotalPrice().toFixed(2)}</strong>
                                </div>
                            </>
                        )}
                        <button
                            className={styles.closeCartButton}
                            onClick={() => setIsCartOpen(false)}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                </div>
            )}
            <footer className={styles.footer}>
                <p className={styles.footerText}>© 2023 113 Stand</p>
            </footer>
        </>
    );
}