import { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

interface NumberTickerProps {
  value: number;
}

export default function NumberTicker({ value }: NumberTickerProps) {
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(value);
  const spring = useSpring(count, { damping: 28, stiffness: 120 });
  const formatted = useTransform(spring, (latest) =>
    new Intl.NumberFormat("ar-SY", { maximumFractionDigits: 0 }).format(Math.round(latest)),
  );

  useEffect(() => {
    if (reduceMotion) {
      count.jump(value);
      return;
    }

    const animation = animate(count, value, { duration: 0.45, ease: "easeOut" });
    return () => animation.stop();
  }, [count, reduceMotion, value]);

  return <motion.span aria-label={new Intl.NumberFormat("ar-SY").format(value)}>{formatted}</motion.span>;
}