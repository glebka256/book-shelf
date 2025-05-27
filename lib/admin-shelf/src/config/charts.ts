import { PieChartConfig } from "@/component-lib/charts/pieChart.types"
/** Color Palette for common chart colors */
export enum ChartColors {
    TealBright = 'rgb(20, 184, 166)',
    TealDark = 'rgba(20, 184, 166, 0.1)',
    PurpleBright = 'rgb(99, 102, 241)',
    PurpleDark = 'rgba(99, 102, 241, 0.1)'
}

// PieChart configs
export const defaultLeftAnimated: PieChartConfig = {
    colors: [
        '#27AE60', '#2ECC71', '#F39C12', '#E67E22',
        '#8E44AD', '#9B59B6', '#34495E', '#16A085'
    ],
    borderColor: '#ffffff',
    borderWidth: 2,
    hoverBorderColor: '#ecf0f1',
    hoverBorderWidth: 3,
    showLegend: true,
    legendPosition: 'left',
    animateRotate: true,
    animateScale: true
}

export const thickBordersTop: PieChartConfig = {
    colors: [
        '#FF6B35', '#F7931E', '#FFD23F', '#FF3333',
        '#C7253E', '#821131', '#F8B500', '#FF5722'
    ],
    borderColor: '#2c2c2c',
    borderWidth: 2,
    hoverBorderColor: '#ffffff',
    hoverBorderWidth: 3,
    showLegend: true,
    legendPosition: 'top',
    animateRotate: true,
    animateScale: true
}

export const thinBordersRight: PieChartConfig = {
    colors: [
        '#00D2FF', '#3A7BD5', '#667eea', '#764ba2',
        '#ff9a9e', '#fad0c4', '#a8edea', '#fed6e3'
    ],
    borderColor: '#0a0a0a',
    borderWidth: 1,
    hoverBorderColor: '#ffffff',
    hoverBorderWidth: 2,
    showLegend: true,
    legendPosition: 'right',
    animateRotate: true,
    animateScale: true
}

export const whiteBordersLeft: PieChartConfig = {
    colors: [
        '#27AE60', '#2ECC71', '#F39C12', '#E67E22',
        '#8E44AD', '#9B59B6', '#34495E', '#16A085'
    ],
    borderColor: '#ffffff',
    borderWidth: 2,
    hoverBorderColor: '#ecf0f1',
    hoverBorderWidth: 3,
    showLegend: true,
    legendPosition: 'left',
    animateRotate: true,
    animateScale: false
}

export const minimalistNeatConfig: PieChartConfig = {
    colors: [
        '#333333', '#666666', '#999999', '#CCCCCC',
        '#E8E8E8', '#F5F5F5', '#555555', '#777777'
    ],
    borderColor: '#ffffff',
    borderWidth: 1,
    hoverBorderColor: '#000000',
    hoverBorderWidth: 2,
    showLegend: false,
    legendPosition: 'top',
    animateRotate: false,
    animateScale: false
}