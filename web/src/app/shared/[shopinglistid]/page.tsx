"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Heart, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Tag, Percent, AlertCircle, Share2, Users } from 'lucide-react';
import ShoppingListAnalytics from "../../tesco/compoments/ShoppingListAnalytics";

// Update these interfaces to match those in ShoppingListAnalytics
interface Promotion {
    id: number; // Add this line
    promotionId: string;
    promotionType: string;
    startDate: string;
    endDate: string;
    offerText: string;
    attributes: string[];
    promotionPrice: number | null;
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

interface ShoppingListItem {
    id: number;
    shoppingListId: number;
    productId: string;
    quantity: number;
    category: string;
    createdAt: string;
    updatedAt: string;
    product: ProductDetail;
}

interface SharedShoppingList {
    id: number;
    name: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    shared: boolean;
    sharedUrlId: string;
    items: ShoppingListItem[];
}

interface PageProps {
    params: {
        shopinglistid: string;
    };
}

const categoryMap: { [key: string]: string } = {
    trvanlivePotraviny: 'Trvanlivé Potraviny',
    specialnaAZdravaVyziva: 'Špeciálna a Zdravá Výživa',
    pecivo: 'Pečivo',
    ovocieAZeleniny: 'Ovocie a Zeleniny',
    napoje: 'Nápoje',
    mrazenePotraviny: 'Mrazené Potraviny',
    mliecneVyrobkyAVajcia: 'Mliečne Výrobky a Vajcia',
    masoRybyALahodky: 'Mäso, Ryby a Lahôdky',
    grilovanie: 'Grilovanie',
    alkohol: 'Alkohol',
    starostlivostODomacnost: 'Starostlivosť o Domácnosť'
};






export default function SharedShoppingList({ params }: PageProps) {
    const { user } = useUser();
    const [sharedList, setSharedList] = useState<SharedShoppingList | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSharedList = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/shopping-list/shared/${params.shopinglistid}`);
                setSharedList(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load the shared shopping list. Please try again later.');
                setLoading(false);
            }
        };

        fetchSharedList();
    }, [params.shopinglistid]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    if (!sharedList) {
        return <div className="flex justify-center items-center h-screen">No shared list found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="p-6 sm:p-10">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">{sharedList.name}</h1>
                            <div className="flex items-center space-x-2 text-indigo-600 bg-indigo-100 px-4 py-2 rounded-full">
                                <Users size={24} />
                                <span className="text-lg font-semibold">Shared List</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <ShoppingListAnalytics list={sharedList} />
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Items in this list</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sharedList.items.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200">
                                    <div className="relative h-48 bg-gray-100">
                                        <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-contain p-4" />
                                        {item.product.hasPromotions && (
                                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                On Sale
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-2 h-14 overflow-hidden">{item.product.title}</h2>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <p className="text-2xl font-bold text-indigo-600">
                                                €{(item.product.promotions[0]?.promotionPrice || item.product.price).toFixed(2)}
                                            </p>
                                            {item.product.hasPromotions && (
                                                <p className="text-sm text-gray-500 line-through">€{item.product.price.toFixed(2)}</p>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center mb-2 text-sm">
                                            <span className="text-gray-600">Qty: {item.quantity}</span>
                                            <span className="text-gray-600">€{item.product.unitPrice.toFixed(2)} / {item.product.unitOfMeasure}</span>
                                        </div>
                                        <div className={`flex items-center justify-between mb-2 text-sm ${item.product.analytics.priceChangeStatus === 'decreased' ? 'text-green-500' : 'text-red-500'}`}>
                                            <span>Price Change:</span>
                                            <span className="font-medium flex items-center">
                                                {item.product.analytics.priceChangeStatus === 'decreased' ? (
                                                    <>
                                                        <TrendingDown size={16} className="mr-1" />
                                                        -{Math.abs(item.product.analytics.percentageChange).toFixed(1)}%
                                                    </>
                                                ) : (
                                                    <>
                                                        <TrendingUp size={16} className="mr-1" />
                                                        +{Math.abs(item.product.analytics.percentageChange).toFixed(1)}%
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mb-2 text-sm">
                                            <span className="text-gray-600">Buy Recommendation:</span>
                                            <span className={`font-medium flex items-center ${item.product.analytics.isBuyRecommended === 'yes' ? 'text-green-500' :
                                                    item.product.analytics.isBuyRecommended === 'no' ? 'text-red-500' : 'text-blue-500'
                                                }`}>
                                                {item.product.analytics.isBuyRecommended === 'yes' && <Heart size={16} className="mr-1" />}
                                                {item.product.analytics.isBuyRecommended === 'no' && <AlertCircle size={16} className="mr-1" />}
                                                {item.product.analytics.isBuyRecommended === 'neutral' && <DollarSign size={16} className="mr-1" />}
                                                {item.product.analytics.isBuyRecommended}
                                            </span>
                                        </div>
                                        {item.product.promotions.length > 0 && (
                                            <p className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full mt-2 text-center">
                                                {item.product.promotions[0].offerText}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}