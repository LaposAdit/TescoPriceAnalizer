import { PrismaService } from '../prisma.service';
import { ProductCategory } from '../enum/product-category.enum';
export declare class FavoriteService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    addFavorite(userId: string, productId: string, category: ProductCategory): Promise<{
        id: number;
        userId: string;
        productId: string;
        category: string;
        createdAt: Date;
    }>;
    removeFavorite(userId: string, productId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    private getPrismaModel;
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
            analytics: {
                priceDrop: any;
                priceIncrease: any;
                percentageChange: any;
                isBuyRecommended: any;
                isOnSale: any;
                previousPrice: any;
                priceChangeStatus: any;
                averagePrice: any;
                medianPrice: any;
                priceStdDev: any;
                promotionImpact: any;
                lastCalculated: any;
            };
        };
        id: number;
        userId: string;
        productId: string;
        category: string;
        createdAt: Date;
    }[]>;
    isFavorite(userId: string, productId: string): Promise<boolean>;
}
