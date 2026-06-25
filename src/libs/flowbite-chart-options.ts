import merge from "lodash/merge";

import {
    defaultBrandColors,
    resolveBrandColors,
    type BrandColors,
} from "@/libs/branding";

export type FlowbiteApexChartType =
    | "area"
    | "line"
    | "bar"
    | "pie"
    | "donut"
    | "radialBar"
    | "scatter"
    | "bubble"
    | "heatmap"
    | "candlestick"
    | "boxPlot"
    | "radar"
    | "polarArea"
    | "rangeBar"
    | "rangeArea"
    | "treemap";

const chartAccentColors = [
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
];

function readCssBrandColor (
    root: HTMLElement,
    variable: string,
    fallback: string
): string {
    const value = getComputedStyle (root).getPropertyValue (variable).trim ();

    return value || fallback;
}

export function resolveFlowbiteChartColors (
    colors: BrandColors = resolveBrandColors ()
): string[] {
    return [
        colors.primary,
        colors.secondary,
        colors.tertiary,
        ...chartAccentColors,
    ];
}

export function readFlowbiteChartColorsFromDocument (
    root: HTMLElement | null = typeof document !== "undefined"
        ? document.documentElement
        : null
): string[] {
    const defaults = resolveBrandColors ();

    if (! root) {
        return resolveFlowbiteChartColors (defaults);
    }

    return [
        readCssBrandColor (root, "--brand-primary", defaults.primary),
        readCssBrandColor (root, "--brand-secondary", defaults.secondary),
        readCssBrandColor (root, "--brand-tertiary", defaults.tertiary),
        ...chartAccentColors,
    ];
}

export function createFlowbiteChartOptions (
    isDark: boolean,
    overrides?: Record<string, unknown>,
    chartColors: string[] = resolveFlowbiteChartColors ()
): Record<string, unknown> {
    const labelColor = isDark ? "#9CA3AF" : "#6B7280";
    const gridColor = isDark ? "#374151" : "#E5E7EB";

    const defaults: Record<string, unknown> = {
        chart: {
            toolbar: { show: false },
            fontFamily: "inherit",
            background: "transparent",
        },
        theme: {
            mode: isDark ? "dark" : "light",
        },
        colors: chartColors,
        grid: {
            borderColor: gridColor,
            strokeDashArray: 4,
        },
        xaxis: {
            labels: { style: { colors: labelColor } },
        },
        yaxis: {
            labels: { style: { colors: labelColor } },
        },
        legend: {
            labels: { colors: labelColor },
        },
        tooltip: {
            theme: isDark ? "dark" : "light",
        },
    };

    return merge ({}, defaults, overrides ?? {});
}

export { defaultBrandColors };
