import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';

interface ShoppingList {
    id: number;
    name: string;
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

interface Promotion {
    promotionId: string;
    promotionType: string;
    startDate: string;
    endDate: string;
    offerText: string;
    attributes: string[];
    promotionPrice: number | null;
}

interface ShoppingListSidebarProps {
    showSidebar: boolean;
    setShowSidebar: (show: boolean) => void;
    userId: string;
    product: ProductDetail | null;
}

const ShoppingListSidebar: React.FC<ShoppingListSidebarProps> = ({
    showSidebar,
    setShowSidebar,
    userId,
    product
}) => {
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [newListName, setNewListName] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchShoppingLists = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/shopping-list/summaries/${userId}`);
            setShoppingLists(response.data);
        } catch (err) {
            console.error('Error fetching shopping lists:', err);
        }
    };

    const createNewShoppingList = async () => {
        if (!newListName.trim()) return;
        try {
            const response = await axios.post('http://localhost:3000/shopping-list', {
                name: newListName,
                userId: userId
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
        if (!selectedListId || !product) return;
        try {
            await axios.post('http://localhost:3000/shopping-list/item', {
                shoppingListId: selectedListId,
                productId: product.productId,
                quantity: 1,
                category: product.category
            });
            setMessage({ type: 'success', text: 'Item added to shopping list successfully!' });
            setTimeout(() => {
                setShowSidebar(false);
                setSelectedListId(null);
                setMessage(null);
            }, 2000);
        } catch (err) {
            console.error('Error adding item to shopping list:', err);
            setMessage({ type: 'error', text: 'Failed to add item to shopping list. Please try again.' });
        }
    };

    useEffect(() => {
        if (showSidebar) {
            fetchShoppingLists();
        }
    }, [showSidebar]);

    return (
        <>
            {showSidebar && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out z-50"
                        onClick={() => setShowSidebar(false)}
                        style={{ animation: 'fadeIn 0.3s ease-in-out' }}
                    ></div>
                    <div
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-hidden"
                        style={{ animation: 'slideIn 0.3s ease-in-out' }}
                    >
                        <div className="h-full flex flex-col">
                            <div className="px-6 py-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold">Add to Shopping List</h2>
                                    <button
                                        onClick={() => setShowSidebar(false)}
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
                                        <div className="p-8">
                                            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Product Details</div>
                                            {product && (
                                                <>
                                                    <h3 className="mt-1 text-lg font-medium text-gray-900">{product.title}</h3>
                                                    <p className="mt-2 text-sm text-gray-500">{product.category}</p>
                                                    <p className="mt-2 text-sm text-gray-500">€{product.price}</p>
                                                </>
                                            )}
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
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                                {message && (
                                    <div
                                        className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} transition-all duration-300 ease-in-out`}
                                        style={{ animation: 'fadeIn 0.3s ease-in-out' }}
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
            )}
        </>
    );
};

export default ShoppingListSidebar;
