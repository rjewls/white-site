// Import utility for conditional class names
import { clsx, type ClassValue } from "clsx"
// Import utility to merge Tailwind CSS classes
import { twMerge } from "tailwind-merge"

// Combines and merges class names for Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
