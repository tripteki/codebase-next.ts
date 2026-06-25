export type BrandColors = {

    primary: string;
    secondary: string;
    tertiary: string;
};

export const defaultBrandColors: BrandColors = {

    primary: "#2563eb",
    secondary: "#84cc16",
    tertiary: "#1e3a8a",
};

function normalizeHexColor (value: string | undefined, fallback: string): string
{
    const trimmed = value?.trim ();

    if (! trimmed)
    {
        return fallback;
    }

    const normalized = trimmed.startsWith ("#") ? trimmed : `#${trimmed}`;

    if (! /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test (normalized))
    {
        return fallback;
    }

    return normalized.toLowerCase ();
}

export function resolveBrandColors (): BrandColors
{
    return {
        primary: normalizeHexColor (
            process.env.NEXT_PUBLIC_BRAND_PRIMARY,
            defaultBrandColors.primary
        ),
        secondary: normalizeHexColor (
            process.env.NEXT_PUBLIC_BRAND_SECONDARY,
            defaultBrandColors.secondary
        ),
        tertiary: normalizeHexColor (
            process.env.NEXT_PUBLIC_BRAND_TERTIARY,
            defaultBrandColors.tertiary
        ),
    };
}
