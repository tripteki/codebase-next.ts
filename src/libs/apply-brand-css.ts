import type { BrandColors, } from "./branding";

function hexToRgb (hex: string): string
{
    let normalized = hex.trim ().replace (/^#/, "");

    if (normalized.length === 3)
    {
        normalized = normalized.split ("").map ((char) => char + char).join ("");
    }

    if (normalized.length !== 6 || ! /^[0-9a-f]+$/i.test (normalized))
    {
        return "37, 99, 235";
    }

    return [
        parseInt (normalized.slice (0, 2), 16),
        parseInt (normalized.slice (2, 4), 16),
        parseInt (normalized.slice (4, 6), 16),
    ].join (", ");
}

export function brandCssVariables (colors: BrandColors): Record<string, string>
{
    return {
        "--brand-primary": colors.primary,
        "--brand-primary-rgb": hexToRgb (colors.primary),
        "--brand-secondary": colors.secondary,
        "--brand-tertiary": colors.tertiary,
    };
}

export function brandCssInlineStyle (colors: BrandColors): string
{
    return Object.entries (brandCssVariables (colors))
        .map (([ key, value, ]) => `${key}:${value}`)
        .join (";");
}

export function applyBrandCss (root: HTMLElement, colors: BrandColors): void
{
    for (const [ key, value, ] of Object.entries (brandCssVariables (colors)))
    {
        root.style.setProperty (key, value);
    }
}
