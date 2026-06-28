import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
}

/** Базова кнопка на токенах + мікро-моушн (framer-motion). */
export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  disabled,
  ...rest
}: ButtonProps) {
  const cls = ["btn", `btn--${variant}`, size !== "md" && `btn--${size}`]
    .filter(Boolean)
    .join(" ");
  return (
    <motion.button
      type={type}
      className={cls}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { y: 0, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
