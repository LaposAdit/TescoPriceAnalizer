import { PrismaService } from '../prisma.service';
import { ShoppingListDTO, ShoppingListItemDTO, AddToShoppingListResponseDTO, ShoppingListDeleteResponseDTO } from 'src/dto/ShopingListDTO';
export declare class ShoppingListService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    private getDetailedShoppingList;
    getShoppingListSummariesByUserId(userId: string): Promise<{
        id: number;
        name: string;
    }[]>;
    private getModelName;
}
