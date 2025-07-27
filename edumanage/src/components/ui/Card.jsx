import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6', 
  hover = false,
  clickable = false,
  onClick,
  ...props 
}) => {
  const baseClasses = `bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${padding}`;
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200' : '';
  const clickableClasses = clickable ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50' : '';
  
  const CardComponent = clickable ? motion.div : 'div';
  
  return (
    <CardComponent
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      whileHover={clickable ? { scale: 1.01 } : undefined}
      whileTap={clickable ? { scale: 0.99 } : undefined}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;