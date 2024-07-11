import { ShoppingListService } from './shopping-list.service';
import { ShoppingListDTO, ShoppingListItemDTO, AddToShoppingListResponseDTO, ShoppingListDeleteResponseDTO } from 'src/dto/ShopingListDTO';
export declare class ShoppingListController {
    private readonly shoppingListService;
    constructor(shoppingListService: ShoppingListService);
    createShoppingList(dto: ShoppingListDTO): Promise<{
        id: number;
        name: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addItemToShoppingList(dto: ShoppingListItemDTO): Promise<AddToShoppingListResponseDTO>;
    removeItemFromShoppingList(shoppingListId: number, productId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteShoppingList(id: number): Promise<ShoppingListDeleteResponseDTO>;
    getShoppingListById(id: number): Promise<any>;
    getShoppingListsByUserId(userId: string): Promise<any[]>;
    getShoppingListSummaries(userId: string): Promise<{
        id: number;
        name: string;
    }[]>;
}
