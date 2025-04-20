import React from "react";
import styles from "./StarRating.module.css";

const StarRating = ({ value, onChange }) => {
  const maxStars = 5;

  return (
    <div className={styles.rating}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = maxStars - index; 
        return (
          <span
            key={starValue}
            className={`${styles.star} ${starValue <= value ? styles.filled : ""}`}
            onClick={() => onChange(starValue)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
