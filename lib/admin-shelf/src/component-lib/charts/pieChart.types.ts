export interface ChartDistribution {
    label: string;
    value: number;
}

export interface PieChartConfig {
    // Colors
    colors?: string[];
    borderColor?: string;
    borderWidth?: number;
    hoverBorderColor?: string;
    hoverBorderWidth?: number;

    // Legend
    showLegend?: boolean;
    legendPosition?: 'top' | 'bottom' | 'left' | 'right';

    // Animation
    animateRotate?: boolean;
    animateScale?: boolean;
}

export const defaultPieConfig: Required<PieChartConfig> = {
    colors: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ],
    borderColor: '#fff',
    borderWidth: 2,
    hoverBorderColor: '#fff',
    hoverBorderWidth: 3,
    showLegend: true,
    legendPosition: 'top',
    animateRotate: true,
    animateScale: false
};