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
        shared: boolean;
        sharedUrlId: string;
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
        shared: boolean;
        sharedUrlId: string;
    }[]>;
    updateShoppingListSharing(id: number, userId: string, shared: boolean): Promise<{
        id: number;
        name: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        shared: boolean;
        sharedUrlId: string;
    }>;
    private generateSharedUrlId;
    getShoppingListBySharedUrlId(sharedUrlId: string): Promise<any>;
    setItemBought(shoppingListId: number, productId: string, isBought: boolean): Promise<{
        id: number;
        shoppingListId: number;
        productId: string;
        quantity: number;
        category: string;
        isBought: boolean;
        createdAt: Date;
        updatedAt: Date;
        zdravieAKrasaId: number;
        ovocieAZeleninyId: number;
        grilovanieId: number;
        starostlivostODomacnostId: number;
        pecivoId: number;
        masoRybyALahodkyId: number;
        mliecneVyrobkyAVajciaId: number;
        trvanlivePotravinyId: number;
        specialnaAZdravaVyzivaId: number;
        mrazenePotravinyId: number;
        napojeId: number;
        alkoholId: number;
    }>;
    private getModelName;
}
