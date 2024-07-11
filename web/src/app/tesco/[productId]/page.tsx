"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import ProductPriceChart from "../utils/ProductPriceChart";
import HistoryTable from "../utils/HistoryTable";
import { useUser } from '@clerk/clerk-react';
import Header from "@/app/compoments/navbar";
import { Heart, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Tag, Percent, Plus } from 'lucide-react';

interface Promotion {
    promotionId: string;
    promotionType: string;
    startDate: string;
    endDate: string;
    offerText: string;
    attributes: string[];
    promotionPrice: number | null;
}

interface ProductDetail {
    productId: string;
    title: string;
    price: number;
    unitPrice: number;
    imageUrl: string;
    unitOfMeasure: string;
    aisleName: string;
    superDepartmentName: string;
    category: string;
    promotions: Promotion[];
    hasPromotions: boolean;
    lastUpdated: string;
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

interface PageProps {
    params: {
        productId: string;
    };
    searchParams: {
        category: string;
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
    alkohol: 'Alkohol'
};

interface ShoppingList {
    id: number;
    name: string;
}

export default function Page({ params, searchParams }: PageProps) {
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [history, setHistory] = useState<ProductDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [showShoppingListPopup, setShowShoppingListPopup] = useState(false);
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [newListName, setNewListName] = useState('');
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const { user } = useUser();
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showShoppingListSidebar, setShowShoppingListSidebar] = useState(false);






    const fetchFavoriteStatus = async () => {
        if (!user || !product) return;

        try {
            const response = await axios.get<boolean>(`http://localhost:3000/favorites/isFavorite?userId=${user.id}&productId=${product.productId}`, {
                headers: {
                    'accept': '*/*'
                }
            });
            setIsFavorite(response.data);
        } catch (err) {
            console.error('Error checking favorite status:', err);
        }
    };

    const addToFavorites = async () => {
        if (!user) {
            console.error("User not logged in");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/favorites', {
                userId: user.id,
                productId: product?.productId,
                category: product?.category
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Added to favorites:', response.data);
            setIsFavorite(true);
        } catch (err) {
            console.error('Error adding to favorites:', err);
        }
    };

    const removeFromFavorites = async () => {
        if (!user || !product) {
            console.error("User not logged in or product not loaded");
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:3000/favorites?userId=${user.id}&productId=${product.productId}`, {
                headers: {
                    'accept': '*/*'
                }
            });

            console.log('Removed from favorites:', response.data);
            setIsFavorite(false);
        } catch (err) {
            console.error('Error removing from favorites:', err);
        }
    };

    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true);
            setError(null);
            console.log('Fetching product details for:', params.productId, 'with category:', searchParams.category);

            try {
                const productResponse = await axios.get<ProductDetail[]>(`http://localhost:3000/products/${searchParams.category}/${params.productId}`, {
                    headers: {
                        accept: 'application/json',
                    },
                });
                console.log('Product details fetched:', productResponse.data);
                if (productResponse.data.length > 0) {
                    const sortedData = productResponse.data.sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
                    setProduct(sortedData[sortedData.length - 1]);
                    setHistory(sortedData);

                    const analyticsResponse = await axios.get<AnalyticsData>(`http://localhost:3000/products/analytics/${params.productId}`, {
                        headers: {
                            accept: 'application/json',
                        },
                    });
                    console.log('Analytics data fetched:', analyticsResponse.data);
                    setAnalytics(analyticsResponse.data);
                } else {
                    setProduct(null);
                    setAnalytics(null);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product details or analytics:', err);
                setError('Failed to fetch product details or analytics');
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [params.productId, searchParams.category]);

    useEffect(() => {
        fetchFavoriteStatus();
    }, [product]);



    const fetchShoppingLists = async () => {
        if (!user) return;
        try {
            const response = await axios.get(`http://localhost:3000/shopping-list/summaries/${user.id}`);
            setShoppingLists(response.data);
        } catch (err) {
            console.error('Error fetching shopping lists:', err);
        }
    };

    const createNewShoppingList = async () => {
        if (!user || !newListName.trim()) return;
        try {
            const response = await axios.post('http://localhost:3000/shopping-list', {
                name: newListName,
                userId: user.id
            });
            setShoppingLists([...shoppingLists, response.data]);
            setNewListName('');
            setMessage({ type: 'success', text: 'New shopping list created successfully!' });
        } catch (err) {
            console.error('Error creating new shopping list:', err);
            setMessage({ type: 'error', text: 'Failed to create new shopping list. Please try again.' });
        }
    };


    const addToShoppingList = async () => {
        if (!user || !selectedListId || !product) return;
        try {
            await axios.post('http://localhost:3000/shopping-list/item', {
                shoppingListId: selectedListId,
                productId: product.productId,
                quantity: 1,
                category: product.category
            });
            setMessage({ type: 'success', text: 'Item added to shopping list successfully!' });
            setTimeout(() => {
                setShowShoppingListSidebar(false);
                setSelectedListId(null);
                setMessage(null);
            }, 2000);
        } catch (err) {
            console.error('Error adding item to shopping list:', err);
            setMessage({ type: 'error', text: 'Failed to add item to shopping list. Please try again.' });
        }
    };

    useEffect(() => {
        if (showShoppingListPopup) {
            fetchShoppingLists();
        }
    }, [showShoppingListPopup]);

    // Preprocess the history data to consolidate prices by date
    const consolidatedHistory = history.reduce((acc, item) => {
        const date = new Date(item.lastUpdated).toLocaleDateString();
        const price = item.promotions.length > 0 && item.promotions[0].promotionPrice !== null
            ? item.promotions[0].promotionPrice
            : item.price;
        if (!acc[date]) {
            acc[date] = price;
        }
        return acc;
    }, {} as Record<string, number>);

    // Extract the dates and prices
    const chartCategories = Object.keys(consolidatedHistory);
    const combinedData = Object.values(consolidatedHistory);

    return (
        <>
            <div className="min-h-screen rounded-3xl bg-gray-100  py-12 px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div role="status" className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="text-red-500 text-xl font-semibold">{error}</div>
                    </div>
                ) : product ? (
                    <div className="max-w-7xl mx-auto">

                        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                            <div className="p-8">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/3 flex justify-center items-start mb-6 md:mb-0">
                                        <div className="w-[250px] h-[250px] flex items-center justify-center bg-white rounded-lg overflow-hidden shadow-inner">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.title}
                                                className="w-[500px] h-[500px] object-contain"
                                                style={{ mixBlendMode: 'multiply' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="md:w-2/3 md:pl-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex space-x-2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    <Tag size={16} className="mr-1" />
                                                    {categoryMap[product.category] || product.category}
                                                </span>
                                                {product.hasPromotions ? (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                        <Percent size={16} className="mr-1" />
                                                        On Sale
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                                        <DollarSign size={16} className="mr-1" />
                                                        Regular Price
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex space-x-2">
                                                {isFavorite ? (
                                                    <button
                                                        onClick={removeFromFavorites}
                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    >
                                                        <Heart size={16} className="mr-1" />
                                                        Remove from Favorites
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={addToFavorites}
                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        <Heart size={16} className="mr-1" />
                                                        Add to Favorites
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setShowShoppingListPopup(true)}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-full text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                >
                                                    <ShoppingCart size={16} className="mr-1" />
                                                    Add to Shopping List
                                                </button>
                                            </div>
                                        </div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
                                        <div className="mb-6">
                                            {product.hasPromotions && product.promotions.length > 0 && product.promotions[0].promotionPrice !== null ? (
                                                <>
                                                    <div className="flex items-center">
                                                        <span className="text-4xl font-bold text-green-600">€{product.promotions[0].promotionPrice.toFixed(2)}</span>
                                                        <span className="ml-2 text-lg text-gray-600">per {product.unitOfMeasure}</span>
                                                    </div>
                                                    <div className="mt-2 flex items-center">
                                                        <span className="text-xl text-gray-500 line-through">€{product.price.toFixed(2)}</span>
                                                        <span className="ml-2 text-sm text-green-600 font-semibold">
                                                            Save €{(product.price - product.promotions[0].promotionPrice).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </>
                                            ) : analytics && analytics.priceChangeStatus === 'increased' ? (
                                                <>
                                                    <div className="flex items-center">
                                                        <span className="text-4xl font-bold text-indigo-600">€{product.price.toFixed(2)}</span>
                                                        <span className="ml-2 text-lg text-gray-600">per {product.unitOfMeasure}</span>
                                                    </div>
                                                    <div className="mt-2 flex items-center">
                                                        <span className="text-xl text-gray-500 line-through">€{analytics.previousPrice.toFixed(2)}</span>
                                                        <span className="ml-2 text-sm text-red-600 font-semibold">
                                                            Increased by €{(product.price - analytics.previousPrice).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex items-center">
                                                    <span className="text-4xl font-bold text-indigo-600">€{product.price?.toFixed(2) ?? 'N/A'}</span>
                                                    <span className="ml-2 text-lg text-gray-600">per {product.unitOfMeasure}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-sm text-gray-500 mb-1">Unit Price</p>
                                                <p className="text-lg font-semibold">€{product.unitPrice?.toFixed(2) ?? 'N/A'} per {product.unitOfMeasure}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-sm text-gray-500 mb-1">Promotion Status</p>
                                                {product.hasPromotions ? (
                                                    <p className="text-lg font-semibold text-green-600 flex items-center">
                                                        <ShoppingCart size={20} className="mr-2" />
                                                        On Sale
                                                    </p>
                                                ) : (
                                                    <p className="text-lg font-semibold text-gray-600 flex items-center">
                                                        <DollarSign size={20} className="mr-2" />
                                                        Regular Price
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {analytics && (
                            <div className="mt-12 bg-white shadow-xl rounded-lg overflow-hidden">
                                <div className="px-8 py-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Price Analysis</h2>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        <div className="bg-blue-50 rounded-lg p-6">
                                            <div className="text-blue-500 text-sm font-medium uppercase">Current Price</div>
                                            <div className="mt-2 flex items-baseline">
                                                <span className="text-3xl font-semibold text-blue-600">
                                                    €{(product.promotions.length > 0 && product.promotions[0].promotionPrice !== null ? product.promotions[0].promotionPrice : product.price).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`rounded-lg p-6 ${analytics.priceChangeStatus === 'decreased' ? 'bg-green-50' : 'bg-red-50'}`}>
                                            <div className={`${analytics.priceChangeStatus === 'decreased' ? 'text-green-500' : 'text-red-500'} text-sm font-medium uppercase`}>
                                                Price {analytics.priceChangeStatus === 'decreased' ? 'Drop' : 'Increase'}
                                            </div>
                                            <div className="mt-2 flex items-baseline">
                                                <span className={`text-3xl font-semibold ${analytics.priceChangeStatus === 'decreased' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {analytics.priceChangeStatus === 'decreased' ? '-' : '+'}€{(analytics.priceChangeStatus === 'decreased' ? analytics.priceDrop : analytics.priceIncrease).toFixed(2)}
                                                </span>
                                                <span className="ml-2 text-sm text-gray-500">
                                                    ({Math.abs(analytics.percentageChange).toFixed(2)}%)
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <div className="text-gray-500 text-sm font-medium uppercase">Buy Recommendation</div>
                                            <div className="mt-2 flex items-center">
                                                <span className={`text-2xl font-semibold ${analytics.isBuyRecommended === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {analytics.isBuyRecommended === 'yes' ? 'Recommended' : 'Not Recommended'}
                                                </span>
                                                {analytics.isBuyRecommended === 'yes' ? (
                                                    <TrendingUp size={24} className="ml-2 text-green-500" />
                                                ) : (
                                                    <TrendingDown size={24} className="ml-2 text-red-500" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <div className="text-gray-500 text-sm font-medium uppercase">Average Price</div>
                                            <div className="mt-2 text-2xl font-semibold text-gray-900">€{analytics.averagePrice?.toFixed(2) ?? 'N/A'}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <div className="text-gray-500 text-sm font-medium uppercase">Median Price</div>
                                            <div className="mt-2 text-2xl font-semibold text-gray-900">€{analytics.medianPrice?.toFixed(2) ?? 'N/A'}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <div className="text-gray-500 text-sm font-medium uppercase">Price Standard Deviation</div>
                                            <div className="mt-2 text-2xl font-semibold text-gray-900">€{analytics.priceStdDev?.toFixed(2) ?? 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-12 space-y-12">
                            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                                <div className="px-8 py-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Price History</h2>
                                    <HistoryTable history={history} />
                                </div>
                            </div>
                            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                                <div className="px-8 py-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Price History Chart</h2>
                                    <ProductPriceChart data={combinedData} categories={chartCategories} />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-xl font-semibold">Product not found</div>
                    </div>
                )}
            </div >




            {showShoppingListPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4 transform transition-all ease-in-out duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-gray-900">Add to Shopping List</h3>
                            <button
                                onClick={() => setShowShoppingListPopup(false)}
                                className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="shopping-list" className="block text-sm font-medium text-gray-700 mb-2">Select a shopping list</label>
                            <select
                                id="shopping-list"
                                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                value={selectedListId || ''}
                                onChange={(e) => setSelectedListId(Number(e.target.value))}
                            >
                                <option value="">Select a list</option>
                                {shoppingLists.map((list) => (
                                    <option key={list.id} value={list.id}>{list.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="new-list-name" className="block text-sm font-medium text-gray-700 mb-2">Or create a new list</label>
                            <div className="flex items-center">
                                <input
                                    id="new-list-name"
                                    type="text"
                                    className="flex-grow block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                    placeholder="New list name"
                                    value={newListName}
                                    onChange={(e) => setNewListName(e.target.value)}
                                />
                                <button
                                    onClick={createNewShoppingList}
                                    className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        {message && (
                            <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowShoppingListPopup(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150 ease-in-out"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addToShoppingList}
                                className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-150 ease-in-out"
                            >
                                Add to List
                            </button>
                        </div>
                    </div>
                </div>
            )}






            {
                /*
                showShoppingListSidebar && (
                    <>
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out z-50"
                            onClick={() => setShowShoppingListSidebar(false)}
                            style={{
                                animation: 'fadeIn 0.3s ease-in-out'
                            }}
                        ></div>
    
                        <div
                            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-hidden"
                            style={{
                                animation: 'slideIn 0.3s ease-in-out'
                            }}
                        >
                            <div className="h-full flex flex-col">
                                <div className="px-6 py-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                            </svg>
                                            <h2 className="text-2xl font-bold">Add to Shopping List</h2>
                                        </div>
                                        <button
                                            onClick={() => setShowShoppingListSidebar(false)}
                                            className="text-white hover:text-indigo-200 transition duration-150 ease-in-out"
                                        >
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
    
                                <div className="flex-grow overflow-y-auto px-6 py-8 space-y-8 bg-gray-50">
                                    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                                        <div className="md:flex">
                                            <div className="md:flex-shrink-0">
                                                <img className="h-48 w-full object-cover md:w-48" src={product?.imageUrl} alt={product?.title} />
                                            </div>
                                            <div className="p-8">
                                                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{product?.category}</div>
                                                <h3 className="mt-1 text-lg font-medium text-gray-900">{product?.title}</h3>
                                                <p className="mt-2 text-2xl font-bold text-indigo-600">{product?.price?.toFixed(2)} €</p>
                                            </div>
                                        </div>
                                    </div>
    
                                    <div>
                                        <label htmlFor="shopping-list" className="block text-sm font-medium text-gray-700 mb-2">Select a shopping list</label>
                                        <div className="relative">
                                            <select
                                                id="shopping-list"
                                                className="block w-full py-3 px-4 pr-8 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out appearance-none"
                                                value={selectedListId || ''}
                                                onChange={(e) => setSelectedListId(Number(e.target.value))}
                                            >
                                                <option value="">Select a list</option>
                                                {shoppingLists.map((list) => (
                                                    <option key={list.id} value={list.id}>{list.name}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
    
                                    <div>
                                        <label htmlFor="new-list-name" className="block text-sm font-medium text-gray-700 mb-2">Or create a new list</label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                id="new-list-name"
                                                type="text"
                                                className="flex-grow block w-full py-3 px-4 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                                placeholder="New list name"
                                                value={newListName}
                                                onChange={(e) => setNewListName(e.target.value)}
                                            />
                                            <button
                                                onClick={createNewShoppingList}
                                                className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
    
                                    {message && (
                                        <div
                                            className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                } transition-all duration-300 ease-in-out`}
                                            style={{
                                                animation: 'fadeIn 0.3s ease-in-out'
                                            }}
                                        >
                                            <div className="flex items-center">
                                                {message.type === 'success' ? (
                                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                {message.text}
                                            </div>
                                        </div>
                                    )}
                                </div>
    
                                <div className="px-6 py-6 bg-white border-t border-gray-200">
                                    <button
                                        onClick={addToShoppingList}
                                        className="w-full px-6 py-3 text-white text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                                    >
                                        Add to List
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )
                */
            }




        </>
    );
}
