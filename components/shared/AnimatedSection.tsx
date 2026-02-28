"use client";

import { motion } from "framer-motion";

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    /** Delay before the animation starts (seconds) */
    delay?: number;
    /** Direction to slide in from */
    direction?: "up" | "left" | "right" | "none";
}

/**
 * AnimatedSection — wraps any block in a scroll-triggered fade+slide-in
 * animation using Framer Motion's `whileInView` API.
 */
export function AnimatedSection({
    children,
    className,
    delay = 0,
    direction = "up",
}: AnimatedSectionProps) {
    const initial = {
        opacity: 0,
        y: direction === "up" ? 32 : 0,
        x: direction === "left" ? -32 : direction === "right" ? 32 : 0,
    };

    return (
        <motion.div
            className={className}
            initial={initial}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
                duration: 0.65,
                delay,
                ease: "easeOut",
            }}
        >
            {children}
        </motion.div>
    );
}
