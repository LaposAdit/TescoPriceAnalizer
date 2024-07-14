import { ShoppingListService } from './shopping-list.service';
import { ShoppingListDTO, ShoppingListItemDTO, AddToShoppingListResponseDTO, ShoppingListDeleteResponseDTO, UpdateShoppingListSharingDTO } from 'src/dto/ShopingListDTO';
export declare class ShoppingListController {
    private readonly shoppingListService;
    constructor(shoppingListService: ShoppingListService);
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
    getShoppingListSummaries(userId: string): Promise<{
        id: number;
        name: string;
        shared: boolean;
        sharedUrlId: string;
    }[]>;
    updateShoppingListSharing(id: number, dto: UpdateShoppingListSharingDTO): Promise<{
        id: number;
        name: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        shared: boolean;
        sharedUrlId: string;
    }>;
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
}
