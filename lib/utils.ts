import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Capitalizes the first character of the given string.
 *
 * @param string - The string to be capitalized.
 * @returns A new string with the first character in uppercase and the rest unchanged.
 */
export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Randomly shuffles the elements of an array using a comparison-based sort with random values.
 * @typeParam T - The type of elements in the array.
 * @param array - The array to shuffle.
 * @returns A shuffled copy of the input array with elements in random order.
 * @example
 * const numbers = [1, 2, 3, 4, 5];
 * const shuffled = shuffle(numbers);
 * console.log(shuffled); // [3, 1, 5, 2, 4]
 */
export function shuffle<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
