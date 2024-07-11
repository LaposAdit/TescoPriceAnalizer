"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import Cookies from 'js-cookie';
import { Grid, List, TrendingUp, TrendingDown, DollarSign, Percent, ShoppingCart, BarChart2, ThumbsUp, ThumbsDown, Meh, Smile, Frown, X } from 'lucide-react';

interface Analytics {
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
    promotionImpact: number;
    lastCalculated: string;
}

interface Promotion {
    promotionId: string;
    promotionType: string;
    startDate: string;
    endDate: string;
    offerText: string;
    attributes: string[];
    promotionPrice: number | null;
}

interface Product {
    productId: string;
    title: string;
    price: number;
    unitPrice: number;
    imageUrl: string;
    unitOfMeasure: string;
    isForSale: boolean;
    aisleName: string;
    superDepartmentName: string;
    promotions: Promotion[];
    hasPromotions: boolean;
    lastUpdated: string;
    analytics: Analytics;
}

interface FavoriteItem {
    id: number;
    userId: string;
    productId: string;
    category: string;
    createdAt: string;
    product: Product;
}


// First, ensure the categoryMap is defined in your component or imported
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
    starostlivostODomacnost: 'Starostlivosť o Domácnosť',
    zdravieAKrasa: 'Zdravie a Krása',
};

const FavoritePage: React.FC = () => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<string>('grid');
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const { user, isLoaded } = useUser();

    const fetchFavorites = async (userId: string) => {
        try {
            const response = await axios.get<FavoriteItem[]>(`http://localhost:3000/favorites/${userId}`, {
                headers: {
                    'accept': '*/*'
                }
            });
            setFavorites(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching favorite items:', err);
            setError('Failed to fetch favorite items');
            setLoading(false);
        }
    };

    const handleDelete = async (productId: string) => {
        if (!user) {
            console.error("User not logged in");
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/favorites`, {
                params: {
                    userId: user.id,
                    productId: productId
                },
                headers: {
                    'accept': '*/*'
                }
            });

            // Update the state to remove the deleted item
            setFavorites(prevFavorites => prevFavorites.filter(fav => fav.product.productId !== productId));

            // Optionally, show a success message to the user
            console.log('Item removed from favorites successfully');
        } catch (err) {
            console.error('Error deleting favorite item:', err);
            // Optionally, set an error state or show an error message to the user
            setError('Failed to remove item from favorites. Please try again.');
        }
    };


    // Function to group favorites by category
    const groupByCategory = (items: FavoriteItem[]) => {
        return items.reduce((acc, item) => {
            const category = item.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {} as Record<string, FavoriteItem[]>);
    };

    const groupedFavorites = groupByCategory(favorites);

    useEffect(() => {
        const checkUserAndFetchFavorites = async () => {
            if (!isLoaded) return;

            console.log('User object:', user);
            if (user) {
                fetchFavorites(user.id);
            } else {
                const userIdFromCookie = Cookies.get('ajs_user_id');
                console.log('User ID from cookie:', userIdFromCookie);
                if (userIdFromCookie) {
                    fetchFavorites(userIdFromCookie);
                } else {
                    setError("User not logged in");
                    setLoading(false);
                }
            }
        };

        checkUserAndFetchFavorites();
    }, [isLoaded, user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Calculate overall analytics
    const totalItems = favorites.length;
    const totalValue = favorites.reduce((sum, item) => {
        const currentPrice = item.product.promotions.length > 0 && item.product.promotions[0].promotionPrice !== null
            ? item.product.promotions[0].promotionPrice
            : item.product.price;
        return sum + currentPrice;
    }, 0);
    const averagePrice = totalValue / totalItems || 0;
    const itemsOnSale = favorites.filter(item => item.product.hasPromotions).length;
    const percentOnSale = (itemsOnSale / totalItems) * 100 || 0;
    const totalSavings = favorites.reduce((sum, item) => {
        const regularPrice = item.product.price;
        const currentPrice = item.product.promotions.length > 0 && item.product.promotions[0].promotionPrice !== null
            ? item.product.promotions[0].promotionPrice
            : regularPrice;
        return sum + (regularPrice - currentPrice);
    }, 0);

    const recommendationCounts: { [key: string]: number } = favorites.reduce(
        (counts, item) => {
            const recommendation = item.product.analytics.isBuyRecommended;
            counts[recommendation as keyof typeof counts] = (counts[recommendation as keyof typeof counts] || 0) + 1;
            return counts;
        },
        { yes: 0, no: 0, neutral: 0 }
    );

    let overallRecommendation = 'neutral';
    if (recommendationCounts.yes > recommendationCounts.no && recommendationCounts.yes > recommendationCounts.neutral) {
        overallRecommendation = 'yes';
    } else if (recommendationCounts.no > recommendationCounts.yes && recommendationCounts.no > recommendationCounts.neutral) {
        overallRecommendation = 'no';
    }

    const recommendationSummary =
        overallRecommendation === 'yes' ? 'Buy' :
            overallRecommendation === 'no' ? 'Do Not Buy' :
                'Neutral';




    const GridItem: React.FC<{ product: Product; category: string }> = ({ product, category }) => {
        const displayCategory = categoryMap[category] || category;


        const currentPrice = product.promotions.length > 0 && product.promotions[0].promotionPrice !== null
            ? product.promotions[0].promotionPrice
            : product.price;
        const priceChange = product.analytics.priceChangeStatus === 'decreased'
            ? product.analytics.priceDrop
            : product.analytics.priceIncrease;
        const priceChangePercent = Math.abs(product.analytics.percentageChange);
        const isPriceDecreased = product.analytics.priceChangeStatus === 'decreased';

        return (
            <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl relative group">
                <button
                    onClick={() => handleDelete(product.productId)}
                    className="absolute top-2 right-2 p-1 bg-white bg-opacity-70 rounded-full text-gray-500 hover:text-red-500 hover:bg-opacity-100 transition-all duration-300 z-10"
                    aria-label="Remove from favorites"
                >
                    <X size={20} />
                </button>
                <div className="relative">
                    <img src={product.imageUrl} alt={product.title} className="w-full h-48 object-contain p-[20px]" />
                    {product.hasPromotions && (
                        <span className="absolute top-2 left-2 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            On Sale
                        </span>
                    )}
                </div>
                <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 h-14 overflow-hidden">{product.title}</h2>
                    <div className="flex justify-between items-baseline mb-2">
                        <p className="text-2xl font-bold text-indigo-600">€{currentPrice.toFixed(2)}</p>
                        {product.hasPromotions && (
                            <p className="text-sm text-gray-500 line-through">€{product.price.toFixed(2)}</p>
                        )}
                    </div>
                    <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="text-gray-600">Unit Price:</span>
                        <span className="font-medium">€{product.unitPrice.toFixed(2)} / {product.unitOfMeasure}</span>
                    </div>
                    <div className={`flex items-center justify-between mb-2 text-sm ${isPriceDecreased ? 'text-green-500' : 'text-red-500'}`}>
                        <span>Price Change:</span>
                        <span className="font-medium flex items-center">
                            {isPriceDecreased ? (
                                <>
                                    <TrendingDown size={16} className="mr-1" />
                                    -{priceChangePercent.toFixed(1)}% (€{priceChange.toFixed(2)} less)
                                </>
                            ) : (
                                <>
                                    <TrendingUp size={16} className="mr-1" />
                                    +{priceChangePercent.toFixed(1)}% (€{priceChange.toFixed(2)} more)
                                </>
                            )}
                        </span>
                    </div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-gray-600">Buy Recommendation:</span>
                        <span className={`font-medium flex items-center ${product.analytics.isBuyRecommended === 'yes' ? 'text-green-500' : product.analytics.isBuyRecommended === 'no' ? 'text-red-500' : 'text-blue-500'}`}>
                            {product.analytics.isBuyRecommended === 'yes' && <ThumbsUp size={16} className="mr-1" />}
                            {product.analytics.isBuyRecommended === 'no' && <ThumbsDown size={16} className="mr-1" />}
                            {product.analytics.isBuyRecommended === 'neutral' && <Meh size={16} className="mr-1" />}
                            {product.analytics.isBuyRecommended}
                        </span>
                    </div>
                    {product.promotions.length > 0 && (
                        <p className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full mt-2 text-center">
                            {product.promotions[0].offerText}
                        </p>
                    )}
                </div>
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Favorite Items</h1>

                {/* Analytics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Total Items</span>
                            <ShoppingCart className="h-6 w-6 text-indigo-500" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 mt-2">{totalItems}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Total Value</span>
                            <DollarSign className="h-6 w-6 text-green-500" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 mt-2">€{totalValue.toFixed(2)}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Average Price</span>
                            <BarChart2 className="h-6 w-6 text-blue-500" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 mt-2">€{averagePrice.toFixed(2)}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Items on Sale</span>
                            <Percent className="h-6 w-6 text-purple-500" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 mt-2">{percentOnSale.toFixed(1)}%</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Total Savings</span>
                            <TrendingDown className="h-6 w-6 text-red-500" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 mt-2">€{totalSavings.toFixed(2)}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Overall Recommendation</span>
                            {overallRecommendation === 'yes' && <Smile className="h-6 w-6 text-green-500" />}
                            {overallRecommendation === 'no' && <Frown className="h-6 w-6 text-red-500" />}
                            {overallRecommendation === 'neutral' && <Meh className="h-6 w-6 text-blue-500" />}
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 mt-2">{recommendationSummary}</p>
                    </div>
                </div>






                {/* View Mode Selector and Category Toggle */}
                <div className="mb-6 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showCategories}
                                onChange={(e) => setShowCategories(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Group by Categories</span>
                        </label>
                    </div>
                    <div className="flex">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'} mr-2`}
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                {showCategories ? (
                    Object.entries(groupedFavorites).map(([category, items]) => (
                        <div key={category} className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{categoryMap[category] || category}</h2>
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                    {items.map((item) => (
                                        <GridItem key={item.product.productId} product={item.product} category={category} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white shadow-md rounded-xl overflow-hidden mb-6">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Product</th>
                                                <th scope="col" className="px-6 py-3">Current Price</th>
                                                <th scope="col" className="px-6 py-3">Previous Price</th>
                                                <th scope="col" className="px-6 py-3">Price Change</th>
                                                <th scope="col" className="px-6 py-3">Buy Recommendation</th>
                                                <th scope="col" className="px-6 py-3">Promotion</th>
                                                <th scope="col" className="px-6 py-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item) => {
                                                const product = item.product;
                                                const currentPrice = product.promotions.length > 0 && product.promotions[0].promotionPrice !== null
                                                    ? product.promotions[0].promotionPrice
                                                    : product.price;
                                                return (
                                                    <tr key={product.productId} className="bg-white border-b hover:bg-gray-50">
                                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                                                            <img src={product.imageUrl} alt={product.title} className="w-12 h-12 object-cover rounded-md mr-4" />
                                                            {product.title}
                                                        </td>
                                                        <td className="px-6 py-4 font-semibold text-indigo-600">
                                                            €{currentPrice.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-500">
                                                            €{product.price.toFixed(2)}
                                                        </td>
                                                        <td className={`px-6 py-4 ${product.analytics.priceChangeStatus === 'decreased' ? 'text-green-600' : 'text-red-600'}`}>
                                                            {product.analytics.percentageChange.toFixed(1)}%
                                                        </td>
                                                        <td className={`px-6 py-4 ${product.analytics.isBuyRecommended === 'yes' ? 'text-green-600' : product.analytics.isBuyRecommended === 'no' ? 'text-red-600' : 'text-blue-600'}`}>
                                                            {product.analytics.isBuyRecommended === 'yes' && <ThumbsUp size={16} className="mr-1" />}
                                                            {product.analytics.isBuyRecommended === 'no' && <ThumbsDown size={16} className="mr-1" />}
                                                            {product.analytics.isBuyRecommended === 'neutral' && <Meh size={16} className="mr-1" />}
                                                            {product.analytics.isBuyRecommended}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {product.promotions.length > 0 ? (
                                                                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">{product.promotions[0].offerText}</span>
                                                            ) : (
                                                                <span className="text-sm text-gray-500">No promotion</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <button
                                                                onClick={() => handleDelete(product.productId)}
                                                                className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                                                aria-label="Remove from favorites"
                                                            >
                                                                <X size={20} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {favorites.map((item) => (
                                <GridItem key={item.product.productId} product={item.product} category={item.category} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white shadow-md rounded-xl overflow-hidden">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Product</th>
                                        <th scope="col" className="px-6 py-3">Category</th>
                                        <th scope="col" className="px-6 py-3">Current Price</th>
                                        <th scope="col" className="px-6 py-3">Previous Price</th>
                                        <th scope="col" className="px-6 py-3">Price Change</th>
                                        <th scope="col" className="px-6 py-3">Buy Recommendation</th>
                                        <th scope="col" className="px-6 py-3">Promotion</th>
                                        <th scope="col" className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {favorites.map((item) => {
                                        const product = item.product;
                                        const currentPrice = product.promotions.length > 0 && product.promotions[0].promotionPrice !== null
                                            ? product.promotions[0].promotionPrice
                                            : product.price;
                                        return (
                                            <tr key={product.productId} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                                                    <img src={product.imageUrl} alt={product.title} className="w-12 h-12 object-cover rounded-md mr-4" />
                                                    {product.title}
                                                </td>
                                                <td className="px-6 py-4">{categoryMap[item.category] || item.category}</td>
                                                <td className="px-6 py-4 font-semibold text-indigo-600">
                                                    €{currentPrice.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    €{product.price.toFixed(2)}
                                                </td>
                                                <td className={`px-6 py-4 ${product.analytics.priceChangeStatus === 'decreased' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {product.analytics.percentageChange.toFixed(1)}%
                                                </td>
                                                <td className={`px-6 py-4 ${product.analytics.isBuyRecommended === 'yes' ? 'text-green-600' : product.analytics.isBuyRecommended === 'no' ? 'text-red-600' : 'text-blue-600'}`}>
                                                    {product.analytics.isBuyRecommended === 'yes' && <ThumbsUp size={16} className="mr-1" />}
                                                    {product.analytics.isBuyRecommended === 'no' && <ThumbsDown size={16} className="mr-1" />}
                                                    {product.analytics.isBuyRecommended === 'neutral' && <Meh size={16} className="mr-1" />}
                                                    {product.analytics.isBuyRecommended}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {product.promotions.length > 0 ? (
                                                        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">{product.promotions[0].offerText}</span>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">No promotion</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleDelete(product.productId)}
                                                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                                        aria-label="Remove from favorites"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default FavoritePage;
