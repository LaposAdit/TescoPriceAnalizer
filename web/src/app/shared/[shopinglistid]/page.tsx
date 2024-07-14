"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Heart, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Tag, AlertCircle, BarChart2, Users, Check, ShoppingBasket, Trash2 } from 'lucide-react';
import ShoppingListAnalytics from "../../tesco/compoments/ShoppingListAnalytics";

// Update these interfaces to match those in ShoppingListAnalytics
interface Promotion {
    id: number;
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
    isBought: boolean; // Add isBought property
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

    const toggleItemBought = async (listId: number, productId: string, isBought: boolean) => {
        try {
            await axios.patch(`http://localhost:3000/shopping-list/item/${listId}/${productId}/bought`, {
                isBought,
            });
            // Update the local state with the new bought status
            setSharedList(prevList => {
                if (!prevList) return prevList;
                const updatedItems = prevList.items.map(item =>
                    item.productId === productId ? { ...item, isBought } : item
                );
                return { ...prevList, items: updatedItems };
            });
        } catch (error) {
            console.error("Error updating item bought status:", error);
        }
    };

    const deleteItem = async (listId: number, productId: string) => {
        try {
            await axios.delete(`http://localhost:3000/shopping-list/item/${listId}/${productId}`);
            // Update the local state by removing the deleted item
            setSharedList(prevList => {
                if (!prevList) return prevList;
                const updatedItems = prevList.items.filter(item => item.productId !== productId);
                return { ...prevList, items: updatedItems };
            });
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    if (!sharedList) {
        return <div className="flex justify-center items-center h-screen">No shared list found.</div>;
    }

    const needToBuyItems = sharedList.items.filter(item => !item.isBought);
    const boughtItems = sharedList.items.filter(item => item.isBought);

    const totalBoughtPrice = boughtItems.reduce((total, item) => {
        const itemPrice = item.product.promotions[0]?.promotionPrice || item.product.price;
        return total + (itemPrice * item.quantity);
    }, 0);

    const renderItem = (item: ShoppingListItem, toggleItemBought: Function, deleteItem: Function) => (
        <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-200">
            <div className="relative p-4">
                <button
                    onClick={() => deleteItem(item.shoppingListId, item.product.productId)}
                    className="absolute top-2 right-2 p-1 bg-white bg-opacity-70 rounded-full text-gray-500 hover:text-red-500 hover:bg-opacity-100 transition-all duration-300 z-10"
                    aria-label="Remove item"
                >
                    <Trash2 size={20} />
                </button>
                <div className="flex items-start space-x-4">
                    <img src={item.product.imageUrl} alt={item.product.title} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{item.product.title}</h3>
                        <div className="flex items-baseline mb-2">
                            <p className="text-xl font-bold text-indigo-600 mr-2">
                                €{(item.product.promotions[0]?.promotionPrice || item.product.price).toFixed(2)}
                            </p>
                            {item.product.hasPromotions && (
                                <p className="text-sm text-gray-500 line-through">€{item.product.price.toFixed(2)}</p>
                            )}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                            <span className="mr-3">Qty: {item.quantity}</span>
                            <span>€{item.product.unitPrice.toFixed(2)} / {item.product.unitOfMeasure}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className={`flex items-center ${item.product.analytics.priceChangeStatus === 'decreased' ? 'text-green-500' : 'text-red-500'}`}>
                                {item.product.analytics.priceChangeStatus === 'decreased' ? (
                                    <TrendingDown size={16} className="mr-1" />
                                ) : (
                                    <TrendingUp size={16} className="mr-1" />
                                )}
                                <span>
                                    {Math.abs(item.product.analytics.percentageChange).toFixed(1)}%
                                    (€{item.product.analytics.priceChangeStatus === 'decreased' ? item.product.analytics.priceDrop.toFixed(2) : item.product.analytics.priceIncrease.toFixed(2)}
                                    {item.product.analytics.priceChangeStatus === 'decreased' ? ' less' : ' more'})
                                </span>
                            </div>
                            <div className={`flex items-center ${item.product.analytics.isBuyRecommended === 'yes' ? 'text-green-500' :
                                item.product.analytics.isBuyRecommended === 'no' ? 'text-red-500' : 'text-blue-500'
                                }`}>
                                {item.product.analytics.isBuyRecommended === 'yes' && <Heart size={16} className="mr-1" />}
                                {item.product.analytics.isBuyRecommended === 'no' && <AlertCircle size={16} className="mr-1" />}
                                {item.product.analytics.isBuyRecommended === 'neutral' && <DollarSign size={16} className="mr-1" />}
                                {item.product.analytics.isBuyRecommended}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                onClick={() => toggleItemBought(item.shoppingListId, item.product.productId, !item.isBought)}
                className={`flex items-center justify-center py-3 cursor-pointer transition-all duration-300 ${item.isBought
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-indigo-500 hover:bg-indigo-600'
                    }`}
            >
                <ShoppingBasket size={20} className="text-white" />
                <span className="ml-2 font-medium text-white">
                    {item.isBought ? 'In Basket' : 'Add to Basket'}
                </span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="p-6 sm:p-10">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">{sharedList.name}</h1>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                                <BarChart2 size={24} className="mr-2 text-indigo-600" />
                                Shopping List Analytics
                            </h2>
                            <ShoppingListAnalytics list={sharedList} />
                        </div>

                        <div className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                                <ShoppingCart size={24} className="mr-2 text-indigo-600" />
                                Need to Buy ({needToBuyItems.length})
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {needToBuyItems.map(item => renderItem(item, toggleItemBought, deleteItem))}
                            </div>
                        </div>

                        {boughtItems.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <Check size={24} className="mr-2 text-green-500" />
                                    In Basket ({boughtItems.length})
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {boughtItems.map(item => renderItem(item, toggleItemBought, deleteItem))}
                                </div>
                                <div className="mt-6 text-lg font-semibold text-gray-900">
                                    Total Price: €{totalBoughtPrice.toFixed(2)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
