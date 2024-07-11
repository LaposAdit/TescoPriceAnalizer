"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ShoppingList {
    id: number;
    name: string;
    userId: string;
    items: ShoppingListItem[];
}

interface ShoppingListItem {
    id: number;
    productId: string;
    quantity: number;
    category: string;
}

const ShoppingListPage: React.FC = () => {
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [newListName, setNewListName] = useState('');
    const [newItemProductId, setNewItemProductId] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState(1);
    const [newItemCategory, setNewItemCategory] = useState('');
    const [selectedListId, setSelectedListId] = useState<number | null>(null);

    const userId = 'user123'; // Replace with actual user ID or authentication logic

    useEffect(() => {
        fetchShoppingLists();
    }, []);

    const fetchShoppingLists = async () => {
        try {
            const response = await axios.get(`/api/shopping-list/user/${userId}`);
            setShoppingLists(response.data);
        } catch (error) {
            console.error('Error fetching shopping lists:', error);
        }
    };

    const createShoppingList = async () => {
        try {
            await axios.post('/api/shopping-list', { name: newListName, userId });
            setNewListName('');
            fetchShoppingLists();
        } catch (error) {
            console.error('Error creating shopping list:', error);
        }
    };

    const addItemToList = async () => {
        if (!selectedListId) return;
        try {
            await axios.post('/api/shopping-list/item', {
                shoppingListId: selectedListId,
                productId: newItemProductId,
                quantity: newItemQuantity,
                category: newItemCategory,
            });
            setNewItemProductId('');
            setNewItemQuantity(1);
            setNewItemCategory('');
            fetchShoppingLists();
        } catch (error) {
            console.error('Error adding item to shopping list:', error);
        }
    };

    const removeItemFromList = async (listId: number, productId: string) => {
        try {
            await axios.delete(`/api/shopping-list/item/${listId}/${productId}`);
            fetchShoppingLists();
        } catch (error) {
            console.error('Error removing item from shopping list:', error);
        }
    };

    const deleteShoppingList = async (listId: number) => {
        try {
            await axios.delete(`/api/shopping-list/${listId}`);
            fetchShoppingLists();
        } catch (error) {
            console.error('Error deleting shopping list:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Shopping Lists</h1>

            <div className="mb-4">
                <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="New list name"
                    className="border p-2 mr-2"
                />
                <button onClick={createShoppingList} className="bg-blue-500 text-white p-2 rounded">
                    Create List
                </button>
            </div>

            {shoppingLists.map((list) => (
                <div key={list.id} className="border p-4 mb-4">
                    <h2 className="text-xl font-semibold mb-2">{list.name}</h2>
                    <button onClick={() => deleteShoppingList(list.id)} className="bg-red-500 text-white p-2 rounded mb-2">
                        Delete List
                    </button>
                    <ul>
                        {list.items.map((item) => (
                            <li key={item.id} className="flex justify-between items-center mb-2">
                                <span>{item.productId} - Quantity: {item.quantity}</span>
                                <button onClick={() => removeItemFromList(list.id, item.productId)} className="bg-red-300 p-1 rounded">
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    {selectedListId === list.id && (
                        <div className="mt-2">
                            <input
                                type="text"
                                value={newItemProductId}
                                onChange={(e) => setNewItemProductId(e.target.value)}
                                placeholder="Product ID"
                                className="border p-2 mr-2"
                            />
                            <input
                                type="number"
                                value={newItemQuantity}
                                onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                                placeholder="Quantity"
                                className="border p-2 mr-2"
                            />
                            <input
                                type="text"
                                value={newItemCategory}
                                onChange={(e) => setNewItemCategory(e.target.value)}
                                placeholder="Category"
                                className="border p-2 mr-2"
                            />
                            <button onClick={addItemToList} className="bg-green-500 text-white p-2 rounded">
                                Add Item
                            </button>
                        </div>
                    )}
                    <button onClick={() => setSelectedListId(list.id)} className="text-blue-500 mt-2">
                        {selectedListId === list.id ? 'Cancel' : 'Add Item'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ShoppingListPage;