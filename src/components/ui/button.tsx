// React and Radix UI imports
import * as React from "react"
// Slot for custom component composition
import { Slot } from "@radix-ui/react-slot"
// Class variance authority for styling variants
import { cva, type VariantProps } from "class-variance-authority"

// Utility for merging class names
import { cn } from "@/lib/utils"

// Button style variants using cva
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        elegant: "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:from-blue-700 hover:to-sky-700 transition-all duration-300 font-medium",
        soft: "bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-md hover:shadow-lg transition-all duration-300 border border-blue-200",
        admin: "bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:from-blue-600 hover:to-sky-600 shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// ButtonProps interface for button component
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
