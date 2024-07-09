import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const DynamicApexCharts = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

interface ProductPriceChartProps {
    data: number[];
    categories: string[];
}

const ProductPriceChart: React.FC<ProductPriceChartProps> = ({ data, categories }) => {
    // Ensure all data points are positive
    const positiveData = data.map(price => Math.max(0, price));

    const options: ApexOptions = {
        chart: {
            height: 350,
            type: "area",
            fontFamily: "Inter, sans-serif",
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
        },
        tooltip: {
            enabled: true,
            theme: 'light',
            x: {
                show: true,
                format: 'dd MMM yyyy',
            },
            y: {
                formatter: (value) => `€${value.toFixed(2)}`,
            },
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3,
                stops: [0, 90, 100],
                colorStops: [
                    {
                        offset: 0,
                        color: "#60A5FA",
                        opacity: 0.7
                    },
                    {
                        offset: 100,
                        color: "#93C5FD",
                        opacity: 0.3
                    },
                ]
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 3,
            colors: ['#3B82F6'],
        },
        grid: {
            show: true,
            borderColor: '#E5E7EB',
            strokeDashArray: 4,
            padding: {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10,
            },
        },
        xaxis: {
            categories: categories,
            labels: {
                rotate: -45,
                rotateAlways: false,
                hideOverlappingLabels: true,
                trim: true,
                style: {
                    fontSize: '12px',
                    fontWeight: 500,
                    colors: ['#6B7280'],
                },
                format: 'dd MMM yy',
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            min: 0,
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 500,
                    colors: ['#6B7280'],
                },
                formatter: (value) => `€${value.toFixed(2)}`,
            },
        },
        markers: {
            size: 4,
            colors: ['#3B82F6'],
            strokeColors: '#FFFFFF',
            strokeWidth: 2,
            hover: {
                size: 6,
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    height: 300,
                },
            },
        }],
    };

    const series = [
        {
            name: "Product Price",
            data: positiveData,
        }
    ];

    return (
        <DynamicApexCharts
            options={options}
            series={series}
            type="area"
            height={350}
            width="100%"
        />
    );
};

export default ProductPriceChart;