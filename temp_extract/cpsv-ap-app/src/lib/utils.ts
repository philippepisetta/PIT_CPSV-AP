// src/lib/utils.ts

import clsx from "clsx";
import { ClassValue } from "clsx";

/**
 * Merge class names intelligently using `clsx`.
 * Accepts strings, objects, arrays – same API as `clsx`.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
