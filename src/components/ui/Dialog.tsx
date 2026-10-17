import type { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  contentClassName: string;
  children: ReactNode;
}

export default function Dialog({
  open,
  onOpenChange,
  title,
  description,
  contentClassName,
  children,
}: DialogProps) {
  const reduceMotion = useReducedMotion();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal forceMount>
        <AnimatePresence>
          {open && (
            <>
              <DialogPrimitive.Overlay forceMount asChild>
                <motion.div
                  key="dialog-overlay"
                  className="fixed inset-0 z-[60] bg-stone-950/45"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: reduceMotion ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.16 }}
                />
              </DialogPrimitive.Overlay>
              <DialogPrimitive.Content forceMount asChild>
                <motion.div
                  key="dialog-content"
                  className="pointer-events-none fixed inset-0 z-[61] flex items-end justify-center sm:items-center sm:p-4"
                  initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.99 }}
                  transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
                >
                  <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
                  <DialogPrimitive.Description className="sr-only">{description}</DialogPrimitive.Description>
                  <div className={`pointer-events-auto ${contentClassName}`}>{children}</div>
                </motion.div>
              </DialogPrimitive.Content>
            </>
          )}
        </AnimatePresence>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}