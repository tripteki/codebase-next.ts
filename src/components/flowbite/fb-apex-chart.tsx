"use client";

import dynamic from "next/dynamic";
import type { ApexOptions, } from "apexcharts";
import merge from "lodash/merge";
import { useMemo, type ReactElement, } from "react";

import { useTheme, } from "@/hooks/theme";
import { fbCard, } from "@/libs/flowbite-classes";
import {
    createFlowbiteChartOptions,
    readFlowbiteChartColorsFromDocument,
    type FlowbiteApexChartType,
} from "@/libs/flowbite-chart-options";
import { cn, } from "@/libs/utils";

const ApexChart = dynamic (() => import ("react-apexcharts"), { ssr: false, });

export type FbApexChartProps = {
    type?: FlowbiteApexChartType;
    height?: string | number;
    width?: string | number;
    options?: ApexOptions;
    series: NonNullable<ApexOptions["series"]>;
    card?: boolean;
    className?: string;
};

const FbApexChart = ({
    type = "area",
    height = 320,
    width,
    options,
    series,
    card = false,
    className,
}: FbApexChartProps): ReactElement => {
    const { theme, mounted, } = useTheme ();

    const mergedOptions = useMemo(() => {
        const isDark = mounted && theme === "dark";
        const chartColors = readFlowbiteChartColorsFromDocument ();

        return createFlowbiteChartOptions (isDark, merge ({
            chart: { type },
        }, (options ?? {}) as Record<string, unknown>), chartColors);
    }, [ mounted, theme, type, options, ]);

    return (
        <div className={cn (card && fbCard, className)}>
            <ApexChart
                type={type}
                height={height}
                width={width}
                options={mergedOptions as ApexOptions}
                series={series}
            />
        </div>
    );
};

export default FbApexChart;
