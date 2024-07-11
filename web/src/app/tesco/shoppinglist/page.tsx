"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Grid, List, Share2, Trash2, Link2, TrendingDown, X, TrendingUp, ThumbsUp, ThumbsDown, Meh } from 'lucide-react';

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

const GridItem: React.FC<{ item: ShoppingListItem; listId: number; removeItemFromList: (listId: number, productId: string) => void }> = ({ item, listId, removeItemFromList }) => {
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
        <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl relative group">
            <button
                onClick={() => removeItemFromList(listId, product.productId)}
                className="absolute top-2 right-2 p-1 bg-white bg-opacity-70 rounded-full text-gray-500 hover:text-red-500 hover:bg-opacity-100 transition-all duration-300 z-10"
                aria-label="Remove from list"
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

const ShoppingListPage: React.FC = () => {
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [newListName, setNewListName] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            fetchShoppingLists();
        }
    }, [user]);

    const fetchShoppingLists = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/shopping-list/user/${user?.id}`);
            setShoppingLists(response.data);
        } catch (error) {
            console.error("Error fetching shopping lists:", error);
        }
    };

    const createShoppingList = async () => {
        if (!newListName.trim() || !user) return;
        try {
            await axios.post("http://localhost:3000/shopping-list", { name: newListName, userId: user.id });
            setNewListName("");
            fetchShoppingLists();
        } catch (error) {
            console.error("Error creating shopping list:", error);
        }
    };

    const deleteShoppingList = async (listId: number) => {
        try {
            await axios.delete(`http://localhost:3000/shopping-list/${listId}`);
            fetchShoppingLists();
        } catch (error) {
            console.error("Error deleting shopping list:", error);
        }
    };

    const toggleShareList = async (list: ShoppingList) => {
        try {
            const response = await axios.patch(`http://localhost:3000/shopping-list/${list.id}/share`, {
                userId: list.userId,
                shared: !list.shared,
            });
            const updatedLists = shoppingLists.map((sl) => (sl.id === list.id ? { ...sl, shared: !sl.shared, sharedUrlId: response.data.sharedUrlId } : sl));
            setShoppingLists(updatedLists);
        } catch (error) {
            console.error("Error sharing/unsharing shopping list:", error);
        }
    };

    const removeItemFromList = async (listId: number, productId: string) => {
        try {
            await axios.delete(`http://localhost:3000/shopping-list/item/${listId}/${productId}`);
            fetchShoppingLists();
        } catch (error) {
            console.error("Error removing item from shopping list:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Lists</h1>

                <div className="mb-8 flex justify-between items-center">
                    <div className="flex">
                        <input
                            type="text"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            placeholder="Enter new list name"
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none transition-colors duration-300"
                        />
                        <button
                            onClick={createShoppingList}
                            className="ml-4 px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-300"
                        >
                            Create List
                        </button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-full ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-600 hover:bg-gray-400'}`}
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-full ${viewMode === 'table' ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-600 hover:bg-gray-400'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    {shoppingLists.map((list) => (
                        <div key={list.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-4 flex justify-between items-center border-b">
                                <h2 className="text-xl font-semibold text-gray-800">{list.name}</h2>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => toggleShareList(list)}
                                        className={`p-2 rounded-full ${list.shared ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'}`}
                                        title={list.shared ? "Unshare List" : "Share List"}
                                    >
                                        <Share2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteShoppingList(list.id)}
                                        className="p-2 rounded-full text-gray-400 hover:text-red-500"
                                        title="Delete List"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            {list.shared && list.sharedUrlId && (
                                <div className="px-4 py-2 bg-blue-50 text-sm text-blue-700 flex items-center">
                                    <Link2 size={14} className="mr-2" />
                                    <a
                                        href={`http://localhost:3000/shopping-list/shared/${list.sharedUrlId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        View Shared List
                                    </a>
                                </div>
                            )}
                            {viewMode === 'grid' ? (
                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {list.items.map((item) => (
                                        <GridItem key={item.id} item={item} listId={list.id} removeItemFromList={removeItemFromList} />
                                    ))}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {list.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-2">
                                                        <div className="flex items-center">
                                                            <img className="h-8 w-8 rounded-full mr-3 object-cover" src={item.product.imageUrl} alt={item.product.title} />
                                                            <span className="text-sm font-medium text-gray-900">{item.product.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-500">€{item.product.price.toFixed(2)}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-500">{item.quantity}</td>
                                                    <td className="px-4 py-2 text-sm">
                                                        <button
                                                            onClick={() => removeItemFromList(list.id, item.product.productId)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ShoppingListPage;
