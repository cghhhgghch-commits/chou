import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FadeContentProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  trigger?: "mount" | "scroll";
}

export default function FadeContent({
  children,
  className = "",
  delay = 0,
  duration = 0.55,
  stagger = 0.06,
  trigger = "scroll",
}: FadeContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const targets = content.children.length ? content.children : content;
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          delay,
          duration,
          stagger,
          ease: "power2.out",
          scrollTrigger: trigger === "scroll"
            ? { trigger: content, start: "top 92%", once: true }
            : undefined,
        },
      );
    }, content);

    return () => context.revert();
  }, [delay, duration, stagger, trigger]);

  return <div ref={contentRef} className={className}>{children}</div>;
}