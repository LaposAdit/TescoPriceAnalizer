"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus } from "lucide-react";

interface ShoppingList {
    id: number;
    name: string;
}

interface ProductDetail {
    productId: string;
    title: string;
    category: string;
}

interface ShoppingListPopupProps {
    showPopup: boolean;
    setShowPopup: (show: boolean) => void;
    userId: string;
    product: ProductDetail | null;
}

const ShoppingListPopup: React.FC<ShoppingListPopupProps> = ({
    showPopup,
    setShowPopup,
    userId,
    product,
}) => {
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [newListName, setNewListName] = useState("");
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<string>("1");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const fetchShoppingLists = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/shopping-list/summaries/${userId}`);
            setShoppingLists(response.data);
        } catch (err) {
            console.error("Error fetching shopping lists:", err);
        }
    };

    const createNewShoppingList = async () => {
        if (!newListName.trim()) return;
        try {
            const response = await axios.post("http://localhost:3000/shopping-list", {
                name: newListName,
                userId: userId,
            });
            setShoppingLists([...shoppingLists, response.data]);
            setNewListName("");
            setMessage({ type: "success", text: "New shopping list created successfully!" });
        } catch (err) {
            console.error("Error creating new shopping list:", err);
            setMessage({ type: "error", text: "Failed to create new shopping list. Please try again." });
        }
    };

    const addToShoppingList = async () => {
        if (!selectedListId || !product || quantity === "") return;
        try {
            await axios.post("http://localhost:3000/shopping-list/item", {
                shoppingListId: selectedListId,
                productId: product.productId,
                quantity: parseInt(quantity, 10),
                category: product.category,
            });
            setMessage({ type: "success", text: "Item added to shopping list successfully!" });
            setTimeout(() => {
                setShowPopup(false);
                setSelectedListId(null);
                setQuantity("1");
                setMessage(null);
            }, 2000);
        } catch (err) {
            console.error("Error adding item to shopping list:", err);
            setMessage({ type: "error", text: "Failed to add item to shopping list. Please try again." });
        }
    };

    useEffect(() => {
        if (showPopup) {
            fetchShoppingLists();
        }
    }, [showPopup]);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || /^[1-9]\d*$/.test(value)) {
            setQuantity(value);
        }
    };

    return (
        <>
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4 transform transition-all ease-in-out duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-gray-900">Add to Shopping List</h3>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="shopping-list" className="block text-sm font-medium text-gray-700 mb-2">
                                Select a shopping list
                            </label>
                            <select
                                id="shopping-list"
                                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                value={selectedListId || ""}
                                onChange={(e) => setSelectedListId(Number(e.target.value))}
                            >
                                <option value="">Select a list</option>
                                {shoppingLists.map((list) => (
                                    <option key={list.id} value={list.id}>
                                        {list.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity
                            </label>
                            <input
                                id="quantity"
                                type="text"
                                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                value={quantity}
                                onChange={handleQuantityChange}
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="new-list-name" className="block text-sm font-medium text-gray-700 mb-2">
                                Or create a new list
                            </label>
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
                            <div className={`mb-4 p-3 rounded-md ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {message.text}
                            </div>
                        )}
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowPopup(false)}
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
        </>
    );
};

export default ShoppingListPopup;
