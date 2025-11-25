import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary to-brand-light text-white hover:from-primary/90 hover:to-brand-light/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      animation: {
        none: "",
        pulse: "",
        bounce: "",
        shake: "",
        glow: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

const animationVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
  bounce: {
    y: [0, -8, 0],
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  shake: {
    x: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  glow: {
    boxShadow: [
      "0 0 0 0 rgba(59, 130, 246, 0)",
      "0 0 0 10px rgba(59, 130, 246, 0.1)",
      "0 0 0 0 rgba(59, 130, 246, 0)",
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const hoverVariants = {
  scale: 1.02,
  transition: {
    duration: 0.2,
    ease: "easeOut",
  },
};

const tapVariants = {
  scale: 0.98,
  transition: {
    duration: 0.1,
    ease: "easeInOut",
  },
};

export interface EnhancedButtonProps
  extends Omit<HTMLMotionProps<"button">, "size">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  ripple?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const EnhancedButton = React.forwardRef<
  HTMLButtonElement,
  EnhancedButtonProps
>(({ 
  className, 
  variant, 
  size, 
  animation, 
  asChild = false, 
  loading = false,
  ripple = true,
  iconLeft,
  iconRight,
  children,
  ...props 
}, ref) => {
  const [rippleEffect, setRippleEffect] = React.useState<{
    x: number;
    y: number;
    timestamp: number;
  } | null>(null);

  const Comp = asChild ? Slot : motion.button;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !loading) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setRippleEffect({ x, y, timestamp: Date.now() });
      
      // Clear ripple after animation
      setTimeout(() => setRippleEffect(null), 600);
    }
    
    props.onClick?.(e);
  };

  const motionProps = {
    whileHover: hoverVariants,
    whileTap: tapVariants,
    animate: animation !== "none" ? animationVariants[animation!] : undefined,
    ...props,
  };

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, animation, className }))}
      ref={ref}
      onClick={handleClick}
      disabled={loading || props.disabled}
      {...motionProps}
    >
      {/* Loading Spinner */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        </motion.div>
      )}

      {/* Ripple Effect */}
      {rippleEffect && (
        <motion.span
          key={rippleEffect.timestamp}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: rippleEffect.x,
            top: rippleEffect.y,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ 
            width: 100, 
            height: 100, 
            opacity: 0,
            transition: { duration: 0.6, ease: "easeOut" }
          }}
        />
      )}

      {/* Content */}
      <span className={cn("flex items-center justify-center", loading && "opacity-0")}>
        {iconLeft && <span className="mr-2">{iconLeft}</span>}
        {children}
        {iconRight && <span className="ml-2">{iconRight}</span>}
      </span>
    </Comp>
  );
});

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton, buttonVariants };
