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
        },
        tooltip: {
            enabled: true,
            x: {
                show: false,
                format: 'dd MMM',
            },
            y: {
                formatter: (value) => `€${value.toFixed(2)}`,
            },
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.9,
                stops: [0, 90, 100],
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        grid: {
            show: true,
            borderColor: '#90A4AE',
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
                    fontWeight: 400,
                },
                format: 'dd MMM',
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            min: 0, // Ensure y-axis starts at 0
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 400,
                },
                formatter: (value) => `€${value.toFixed(2)}`,
            },
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
            color: "#1A56DB",
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