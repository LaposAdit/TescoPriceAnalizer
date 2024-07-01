import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from 'src/dto/create-favorite.dto';
export declare class FavoriteController {
    private readonly favoriteService;
    constructor(favoriteService: FavoriteService);
    addFavorite(createFavoriteDto: CreateFavoriteDto): Promise<{
        id: number;
        userId: string;
        productId: string;
        category: string;
        createdAt: Date;
    }>;
    removeFavorite(userId: string, productId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getFavorites(userId: string): Promise<{
        product: {
            productId: any;
            title: any;
            price: any;
            unitPrice: any;
            imageUrl: any;
            unitOfMeasure: any;
            isForSale: any;
            aisleName: any;
            superDepartmentName: any;
            promotions: any;
            hasPromotions: boolean;
            lastUpdated: any;
        };
        id: number;
        userId: string;
        productId: string;
        category: string;
        createdAt: Date;
    }[]>;
}
