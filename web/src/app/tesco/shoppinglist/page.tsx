"use client";
import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Grid, List, Share2, Trash2, Link2, TrendingDown, X, Plus, TrendingUp, ThumbsUp, ThumbsDown, Meh, ChevronUp, ChevronDown, Copy, Check } from 'lucide-react';
import ShoppingListAnalytics from '../compoments/ShoppingListAnalytics';
import GridItem from '../compoments/GridItem';

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

const ShoppingListPage: React.FC = () => {
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [newListName, setNewListName] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const { user } = useUser();
    const [openLists, setOpenLists] = useState<number[]>([]);
    const [copiedUrls, setCopiedUrls] = useState<number[]>([]);

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

    const toggleListOpen = (listId: number) => {
        setOpenLists(prev =>
            prev.includes(listId)
                ? prev.filter(id => id !== listId)
                : [...prev, listId]
        );
    };
    const copyToClipboard = (listId: number, sharedUrlId: string) => {
        const url = `http://localhost:3001/shared/${sharedUrlId}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopiedUrls(prev => [...prev, listId]);
            setTimeout(() => {
                setCopiedUrls(prev => prev.filter(id => id !== listId));
            }, 2000);
        });
    };

    const sortedShoppingLists = useMemo(() => {
        return [...shoppingLists].sort((a, b) => b.id - a.id);
    }, [shoppingLists]);


    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">My Shopping Lists</h1>

                <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New List</h2>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            placeholder="Enter new list name"
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        />
                        <button
                            onClick={createShoppingList}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center"
                        >
                            <Plus size={20} className="mr-2" />
                            Create List
                        </button>
                    </div>
                </div>

                <div className="mb-8 flex justify-end">
                    <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>


                <div className="space-y-8">
                    {sortedShoppingLists.map((list) => {
                        const isOpen = openLists.includes(list.id);
                        const isCopied = copiedUrls.includes(list.id);
                        return (
                            <div key={list.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800">{list.name}</h2>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => toggleShareList(list)}
                                                className={`p-2 rounded-full ${list.shared ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                                title={list.shared ? "Unshare List" : "Share List"}
                                            >
                                                <Share2 size={20} />
                                            </button>
                                            <button
                                                onClick={() => deleteShoppingList(list.id)}
                                                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                                                title="Delete List"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                            <button
                                                onClick={() => toggleListOpen(list.id)}
                                                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                title={isOpen ? "Collapse List" : "Expand List"}
                                            >
                                                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <ShoppingListAnalytics list={list} />

                                    {list.shared && list.sharedUrlId && (
                                        <div className="mt-4 p-4 bg-blue-50 text-sm text-blue-700 rounded-lg flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Link2 size={18} className="mr-3 flex-shrink-0" />
                                                <a
                                                    href={`http://localhost:3001/shared/${list.sharedUrlId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline"
                                                >
                                                    View Shared List
                                                </a>
                                            </div>
                                            <button
                                                onClick={() => list.sharedUrlId && copyToClipboard(list.id, list.sharedUrlId)}
                                                className={`flex items-center px-3 py-1 rounded-md transition-colors duration-200 ${isCopied
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-white text-blue-600 hover:bg-blue-50'
                                                    }`}
                                                disabled={!list.sharedUrlId}
                                            >
                                                {isCopied ? (
                                                    <>
                                                        <Check size={16} className="mr-1" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={16} className="mr-1" />
                                                        Copy URL
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>


                                {isOpen && (
                                    viewMode === 'grid' ? (
                                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {list.items.map((item) => (
                                                <GridItem key={item.id} item={item} listId={list.id} removeItemFromList={removeItemFromList} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {list.items.map((item) => (
                                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <img className="h-10 w-10 rounded-lg mr-3 object-cover" src={item.product.imageUrl} alt={item.product.title} />
                                                                    <span className="text-sm font-medium text-gray-900">{item.product.title}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="text-sm text-gray-900 font-medium">€{item.product.price.toFixed(2)}</span>
                                                                {item.product.hasPromotions && (
                                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                                        On Sale
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <button
                                                                    onClick={() => removeItemFromList(list.id, item.product.productId)}
                                                                    className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ShoppingListPage;
