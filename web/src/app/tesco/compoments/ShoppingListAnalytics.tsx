import React from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Percent, AlertCircle, LucideIcon } from 'lucide-react';

interface ShoppingList {
    id: number;
    name: string;
    userId: string;
    items: ShoppingListItem[];
    shared: boolean;
    sharedUrlId: string | null;
}

interface ShoppingListItem {
    id: number;
    productId: string;
    quantity: number;
    category: string;
    product: ProductDetail;
}

interface ProductDetail {
    dbId: number;
    productId: string;
    title: string;
    price: number;
    unitPrice: number;
    imageUrl: string;
    unitOfMeasure: string;
    isForSale: boolean;
    aisleName: string;
    superDepartmentName: string;
    category: string;
    promotions: Promotion[];
    hasPromotions: boolean;
    lastUpdated: string;
    analytics: AnalyticsData;
}

interface Promotion {
    id: number;
    promotionId: string;
    promotionType: string;
    startDate: string;
    endDate: string;
    offerText: string;
    promotionPrice: number | null;
    attributes: string[];
}

interface AnalyticsData {
    id: number;
    productId: string;
    priceDrop: number;
    priceIncrease: number;
    percentageChange: number;
    isBuyRecommended: string;
    isOnSale: boolean;
    previousPrice: number;
    priceChangeStatus: string;
    averagePrice: number;
    medianPrice: number;
    priceStdDev: number;
    promotionImpact: number | null;
    lastCalculated: string;
    createdAt: string;
    updatedAt: string;
}

interface AnalyticsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    tooltip?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, icon: Icon, color, tooltip }) => (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4 relative group">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="text-white" size={24} />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>
        {tooltip && (
            <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 right-2 bottom-full mb-2 w-48">
                {tooltip}
                <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                </svg>
            </div>
        )}
    </div>
);

interface ShoppingListAnalyticsProps {
    list: ShoppingList;
}

interface ListAnalytics {
    totalItems: number;
    totalValue: number;
    averagePrice: number;
    itemsOnSale: number;
    percentOnSale: number;
    totalSavings: number;
    overallRecommendation: string;
}

const calculateListAnalytics = (list: ShoppingList): ListAnalytics => {
    const totalItems = list.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = list.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const averagePrice = totalValue / totalItems || 0;
    const itemsOnSale = list.items.filter(item => item.product.hasPromotions).reduce((sum, item) => sum + item.quantity, 0);
    const percentOnSale = (itemsOnSale / totalItems) * 100 || 0;
    const totalSavings = list.items.reduce((sum, item) => {
        const regularPrice = item.product.price * item.quantity;
        const currentPrice = item.product.promotions.length > 0 && item.product.promotions[0].promotionPrice !== null
            ? item.product.promotions[0].promotionPrice * item.quantity
            : regularPrice;
        return sum + (regularPrice - currentPrice);
    }, 0);

    const recommendationCounts = list.items.reduce(
        (counts, item) => {
            const recommendation = item.product.analytics.isBuyRecommended;
            counts[recommendation] = (counts[recommendation] || 0) + 1;
            return counts;
        },
        { yes: 0, no: 0, neutral: 0 } as Record<string, number>
    );

    let overallRecommendation = 'neutral';
    if (recommendationCounts.yes > recommendationCounts.no && recommendationCounts.yes > recommendationCounts.neutral) {
        overallRecommendation = 'yes';
    } else if (recommendationCounts.no > recommendationCounts.yes && recommendationCounts.no > recommendationCounts.neutral) {
        overallRecommendation = 'no';
    }

    return {
        totalItems,
        totalValue,
        averagePrice,
        itemsOnSale,
        percentOnSale,
        totalSavings,
        overallRecommendation
    };
};

const ShoppingListAnalytics: React.FC<ShoppingListAnalyticsProps> = ({ list }) => {
    const analytics = calculateListAnalytics(list);

    const formatCurrency = (value: number): string => `€${value.toFixed(2)}`;
    const formatPercent = (value: number): string => `${value.toFixed(1)}%`;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <AnalyticsCard
                title="Total Items"
                value={analytics.totalItems}
                icon={ShoppingCart}
                color="bg-blue-500"
            />
            <AnalyticsCard
                title="Total Value"
                value={formatCurrency(analytics.totalValue)}
                icon={DollarSign}
                color="bg-green-500"
            />
            <AnalyticsCard
                title="Average Price"
                value={formatCurrency(analytics.averagePrice)}
                icon={TrendingUp}
                color="bg-purple-500"
            />
            <AnalyticsCard
                title="Items on Sale"
                value={formatPercent(analytics.percentOnSale)}
                icon={Percent}
                color="bg-yellow-500"
            />
            <AnalyticsCard
                title="Potential Savings"
                value={analytics.totalSavings > 0 ? formatCurrency(analytics.totalSavings) : '€0.00'}
                icon={analytics.totalSavings > 0 ? TrendingDown : AlertCircle}
                color={analytics.totalSavings > 0 ? 'bg-teal-500' : 'bg-orange-500'}
                tooltip={analytics.totalSavings <= 0 ? "No net savings. Some items' increased prices offset potential savings." : undefined}
            />
            <AnalyticsCard
                title="Buy Recommendation"
                value={analytics.overallRecommendation.charAt(0).toUpperCase() + analytics.overallRecommendation.slice(1)}
                icon={analytics.overallRecommendation === 'yes' ? TrendingUp : (analytics.overallRecommendation === 'no' ? TrendingDown : AlertCircle)}
                color={analytics.overallRecommendation === 'yes' ? 'bg-green-500' : (analytics.overallRecommendation === 'no' ? 'bg-red-500' : 'bg-blue-500')}
            />
        </div>
    );
};

export default ShoppingListAnalytics;