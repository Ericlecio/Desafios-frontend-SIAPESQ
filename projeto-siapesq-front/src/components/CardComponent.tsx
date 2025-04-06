// components/CardComponent.tsx
import React from "react";

interface CardProps {
  name: string;
  description: string;
  imageUrl: string;
}

const CardComponent: React.FC<CardProps> = ({
  name,
  description,
  imageUrl,
}) => {
  return (
    <div className="border rounded-lg shadow-md p-4 w-full sm:w-64">
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-40 object-cover rounded-md mb-2"
      />
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p>{description}</p>
    </div>
  );
};

export default CardComponent;
