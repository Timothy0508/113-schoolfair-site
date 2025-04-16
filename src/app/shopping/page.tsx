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

interface OrderSubmission {
    items: {
        id: number;
        quantity: number;
        price: number;
    }[];
    totalPrice: number;
    orderTime: string;
}

interface OrderResponse {
    success: boolean;
    orderId: string;
    estimatedTime?: string;
    message?: string;
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
    const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [estimatedTime, setEstimatedTime] = useState<string | null>(null);

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
            setIsCheckingOut(true);
            setIsCartOpen(false);
        } else {
            alert("Your cart is empty!");
        }
    };

    const submitOrder = async () => {
        setIsSubmitting(true);
        setErrorMessage(null);

        // Prepare order data (simplified without customer info)
        const orderData: OrderSubmission = {
            items: cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            totalPrice: getTotalPrice(),
            orderTime: new Date().toISOString()
        };

        try {
            // Send the order to the API
            const response = await request.post<OrderResponse>("/submit-order", orderData);

            // Handle successful submission
            setOrderSubmitted(true);
            setOrderId(response.data.orderId);
            if (response.data.estimatedTime) {
                setEstimatedTime(response.data.estimatedTime);
            }
            setCart([]);
            console.log("Order submitted successfully:", response.data);

        } catch (error) {
            console.error("Error submitting order:", error);
            setErrorMessage("Failed to submit order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderOrderConfirmation = () => {
        return (
            <div className={styles.checkoutContainer}>
                <div className={styles.orderSummary}>
                    <h3>Order Summary</h3>
                    {cart.map(item => (
                        <div key={item.id} className={styles.cartItem}>
                            <span>{item.name} x {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className={styles.cartTotal}>
                        <strong>Total: ${getTotalPrice().toFixed(2)}</strong>
                    </div>
                </div>

                {errorMessage && (
                    <div className={styles.errorMessage}>{errorMessage}</div>
                )}

                <div className={styles.checkoutActions}>
                    <button
                        className={styles.menuActionButton}
                        onClick={() => setIsCheckingOut(false)}
                    >
                        Back to Shopping
                    </button>
                    <button
                        className={`${styles.menuActionButton} ${styles.submitButton}`}
                        onClick={submitOrder}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'Place Order'}
                    </button>
                </div>
            </div>
        );
    };

    const renderOrderSuccess = () => {
        return (
            <div className={styles.checkoutSuccess}>
                <h2>Order Submitted Successfully!</h2>
                <div className={styles.orderDetails}>
                    <p className={styles.orderIdDisplay}>Order ID: <span>{orderId}</span></p>
                    {estimatedTime && (
                        <p className={styles.estimatedTime}>Estimated Pickup Time: {estimatedTime}</p>
                    )}
                    <p>Thank you for your order. Please keep your order ID for pickup.</p>
                </div>
                <button
                    className={styles.menuActionButton}
                    onClick={() => {
                        setIsCheckingOut(false);
                        setOrderSubmitted(false);
                    }}
                >
                    Continue Shopping
                </button>
            </div>
        );
    };

    return (
        <>
            <header className={styles.header}>
                <h1 className={styles.title}>I Want to &quot;Eat&quot; That Way Pre-order</h1>
                {!isCheckingOut && (
                    <p className={styles.actions}>
                        <button className={styles.button} onClick={() => setIsCartOpen(!isCartOpen)}>
                            <FontAwesomeIcon icon={faCartShopping} className={styles.buttonIcon} />
                            {cart.length > 0 && <span className={styles.cartCount}>{cart.length}</span>}
                        </button>
                    </p>
                )}
            </header>

            {isCheckingOut ? (
                orderSubmitted ? renderOrderSuccess() : renderOrderConfirmation()
            ) : (
                <>
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
                </>
            )}

            {isCartOpen && !isCheckingOut && (
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
                                <button
                                    className={`${styles.menuActionButton} ${styles.cartCheckoutButton}`}
                                    onClick={() => {
                                        setIsCartOpen(false);
                                        handleCheckout();
                                    }}
                                >
                                    Proceed to Checkout
                                </button>
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
                <p className={styles.footerText}>© 2023 I Want to &quot;Eat&quot; That Way</p>
            </footer>
        </>
    );
}