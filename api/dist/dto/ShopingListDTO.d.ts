import { ProductCategory } from 'src/enum/product-category.enum';
export declare class ShoppingListDTO {
    name: string;
    userId: string;
}
export declare class ShoppingListItemDTO {
    shoppingListId: number;
    productId: string;
    quantity: number;
    category: ProductCategory;
}
export declare class ShoppingListItemResponseDTO {
    id: number;
    shoppingListId: number;
    shoppingListName: string;
    productId: string;
    quantity: number;
    category: ProductCategory;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AddToShoppingListResponseDTO {
    success: boolean;
    message: string;
    data: ShoppingListItemResponseDTO | null;
    error?: string;
}
export declare class ShoppingListDeleteResponseDTO {
    success: boolean;
    message: string;
    data?: {
        id: number;
        itemsDeleted: number;
    };
}
export declare class UpdateShoppingListSharingDTO {
    userId: string;
    shared: boolean;
}
