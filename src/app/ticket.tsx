import React from 'react';
import styles from './styles.module.css'; // 導入 CSS 模組
import Image from 'next/image'; // 導入 Next.js 的 Image 組件

interface TicketProps {
  title: string;
  description?: string;
  discount?: string;
  price?: number;
  originalPrice?: number;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
}

const Ticket: React.FC<TicketProps> = ({
  title,
  description,
  discount,
  price,
  originalPrice,
  imageUrl,
  ctaText,
  ctaLink,
}) => {
  return (
    <div className={styles.ticketContainer}> {/* 使用 styles 物件中的類別名稱 */}
      {imageUrl && (
        <div className={styles.imageContainer}>
          <Image src={imageUrl} alt={title} className={styles.ticketImage} />
        </div>
      )}
      <div className={styles.contentContainer}>
        <h3 className={styles.ticketTitle}>{title}</h3>
        {description && <p className={styles.ticketDescription}>{description}</p>}
        <div className={styles.priceInfo}>
          {discount && <span className={styles.ticketDiscount}>{discount}</span>}
          {price !== undefined && (
            <span className={styles.ticketPrice}>
              {originalPrice !== undefined && (
                <span className={styles.originalPrice}>${originalPrice}</span>
              )}
              ${price}
            </span>
          )}
        </div>
        {ctaText && ctaLink && (
          <a href={ctaLink} className={styles.callToAction}>
            {ctaText}
          </a>
        )}
      </div>
    </div>
  );
};

export default Ticket;