import React from 'react';
import { X, TrendingDown, TrendingUp, ThumbsUp, ThumbsDown, Meh } from 'lucide-react';


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

interface GridItemProps {
    item: ShoppingListItem;
    listId: number;
    removeItemFromList: (listId: number, productId: string) => void;
}

const GridItem: React.FC<GridItemProps> = ({ item, listId, removeItemFromList }) => {
    const { product } = item;
    const currentPrice = product.promotions.length > 0 && product.promotions[0].promotionPrice !== null
        ? product.promotions[0].promotionPrice
        : product.price;
    const priceChange = product.analytics.priceChangeStatus === 'decreased'
        ? product.analytics.priceDrop
        : product.analytics.priceIncrease;
    const priceChangePercent = Math.abs(product.analytics.percentageChange);
    const isPriceDecreased = product.analytics.priceChangeStatus === 'decreased';

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 relative group">
            <button
                onClick={() => removeItemFromList(listId, product.productId)}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
                aria-label="Remove from list"
            >
                <X size={16} />
            </button>
            <div className="relative h-48 bg-gray-100">
                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-contain p-4" />
                {product.hasPromotions && (
                    <span className="absolute top-2 left-2 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        On Sale
                    </span>
                )}
            </div>
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 h-14 overflow-hidden">{product.title}</h2>
                <div className="flex justify-between items-baseline mb-3">
                    <p className="text-2xl font-bold text-indigo-600">€{currentPrice.toFixed(2)}</p>
                    {product.hasPromotions && (
                        <p className="text-sm text-gray-400 line-through">€{product.price.toFixed(2)}</p>
                    )}
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-medium">{item.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Unit Price:</span>
                        <span className="font-medium">€{product.unitPrice.toFixed(2)} / {product.unitOfMeasure}</span>
                    </div>
                    <div className={`flex justify-between items-center ${isPriceDecreased ? 'text-green-500' : 'text-red-500'}`}>
                        <span>Price Change:</span>
                        <span className="font-medium flex items-center">
                            {isPriceDecreased ? (
                                <>
                                    <TrendingDown size={14} className="mr-1" />
                                    -{priceChangePercent.toFixed(1)}%
                                </>
                            ) : (
                                <>
                                    <TrendingUp size={14} className="mr-1" />
                                    +{priceChangePercent.toFixed(1)}%
                                </>
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Buy Recommendation:</span>
                        <span className={`font-medium flex items-center ${product.analytics.isBuyRecommended === 'yes' ? 'text-green-500' :
                                product.analytics.isBuyRecommended === 'no' ? 'text-red-500' : 'text-blue-500'
                            }`}>
                            {product.analytics.isBuyRecommended === 'yes' && <ThumbsUp size={14} className="mr-1" />}
                            {product.analytics.isBuyRecommended === 'no' && <ThumbsDown size={14} className="mr-1" />}
                            {product.analytics.isBuyRecommended === 'neutral' && <Meh size={14} className="mr-1" />}
                            {product.analytics.isBuyRecommended}
                        </span>
                    </div>
                </div>
                {product.promotions.length > 0 && (
                    <p className="text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full mt-3 text-center font-medium">
                        {product.promotions[0].offerText}
                    </p>
                )}
            </div>
        </div>
    );
};

export default GridItem;