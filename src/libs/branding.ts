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

export function resolveBrandColors (): BrandColors
{
    return { ... defaultBrandColors, };
}
