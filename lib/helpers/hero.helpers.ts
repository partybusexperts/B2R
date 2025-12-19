import { HeroButtonStyle, HeroData } from "@/types/hero.types";

/**
 * Extracts and normalizes CTA (Call-To-Action) buttons from hero data.
 * Returns up to 3 buttons, defaulting to 'secondary' style if not specified.
 *
 * @param data - The hero data object
 * @returns Array of normalized CTA buttons
 */
export function extractCtaButtons(data: HeroData | null): Array<{
  label: string;
  href: string;
  style: HeroButtonStyle;
}> {
  if (!data?.ctas) return [];

  return data.ctas
    .map(({ label, href, style }) => ({
      label,
      href,
      style: (style ?? "secondary") as HeroButtonStyle,
    }))
    .slice(0, 3);
}

/**
 * Maps button style to CSS class name.
 *
 * @param style - The button style
 * @returns The CSS class name
 */
export function getButtonVariant(
  style?: string,
): "default" | "secondary" | "outline" {
  switch (style) {
    case "secondary":
      return "secondary";
    case "outline":
      return "outline";
    case "primary":
    default:
      return "default";
  }
}

/**
 * Clamps the darken intensity value between 0 and 1.
 * Used for controlling background overlay darkness.
 *
 * @param value - The darken value (default 0.15)
 * @returns Clamped value between 0 and 1
 */
export function clampDarkenIntensity(value: number | undefined): number {
  return Math.min(1, Math.max(0, value ?? 0.15));
}
