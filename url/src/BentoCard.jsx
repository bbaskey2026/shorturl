import React from "react";
import "./BentoCard.css";

const BentoCard = ({ title, children, className }) => {
  return (
    <div className={`bento-card ${className}`}>
      <h2>{title}</h2>
      <div className="card-content">{children}</div>
    </div>
  );
};

export default BentoCard;
