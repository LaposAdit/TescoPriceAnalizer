import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProductCategory } from '../enum/product-category.enum';

@Injectable()
export class FavoriteService {
    constructor(private readonly prisma: PrismaService) { }

    async addFavorite(userId: string, productId: string, category: ProductCategory) {
        return this.prisma.favorite.create({
            data: {
                userId,
                productId,
                category: category as string,
            },
        });
    }

    async removeFavorite(userId: string, productId: string) {
        return this.prisma.favorite.deleteMany({
            where: {
                userId,
                productId,
            },
        });
    }


    private getPrismaModel(category: ProductCategory) {
        const modelMapping: Record<ProductCategory, any> = {
            [ProductCategory.TrvanlivePotraviny]: this.prisma.trvanlivePotraviny,
            [ProductCategory.SpecialnaAZdravaVyziva]: this.prisma.specialnaAZdravaVyziva,
            [ProductCategory.Pecivo]: this.prisma.pecivo,
            [ProductCategory.OvocieAZeleniny]: this.prisma.ovocieAZeleniny,
            [ProductCategory.Napoje]: this.prisma.napoje,
            [ProductCategory.MrazenePotraviny]: this.prisma.mrazenePotraviny,
            [ProductCategory.MliecneVyrobkyAVajcia]: this.prisma.mliecneVyrobkyAVajcia,
            [ProductCategory.MasoRybyALahodky]: this.prisma.masoRybyALahodky,
            [ProductCategory.Grilovanie]: this.prisma.grilovanie,
            [ProductCategory.Alkohol]: this.prisma.alkohol,
            [ProductCategory.StarostlivostODomacnost]: this.prisma.starostlivostODomacnost,
            [ProductCategory.ZdravieAKrasa]: this.prisma.zdravieAKrasa,
        };

        return modelMapping[category];
    }

    async getFavorites(userId: string) {
        const favorites = await this.prisma.favorite.findMany({
            where: { userId },
        });

        const favoriteProducts = await Promise.all(
            favorites.map(async (favorite) => {
                const model = this.getPrismaModel(favorite.category as ProductCategory);
                const product = await model.findFirst({
                    where: { productId: favorite.productId },
                    include: {
                        promotions: true,
                        ProductAnalytics: true
                    },
                    orderBy: { lastUpdated: 'desc' }
                });

                if (!product) {
                    return null; // Handle case where product is not found
                }

                return {
                    ...favorite,
                    product: {
                        productId: product.productId,
                        title: product.title,
                        price: product.price,
                        unitPrice: product.unitPrice,
                        imageUrl: product.imageUrl,
                        unitOfMeasure: product.unitOfMeasure,
                        isForSale: product.isForSale,
                        aisleName: product.aisleName,
                        superDepartmentName: product.superDepartmentName,
                        promotions: product.promotions.map(promo => ({
                            promotionId: promo.promotionId,
                            promotionType: promo.promotionType,
                            startDate: promo.startDate.toISOString(),
                            endDate: promo.endDate.toISOString(),
                            offerText: promo.offerText,
                            attributes: promo.attributes,
                            promotionPrice: promo.promotionPrice,
                        })),
                        hasPromotions: product.promotions.length > 0,
                        lastUpdated: product.lastUpdated,
                        analytics: product.ProductAnalytics ? {
                            priceDrop: product.ProductAnalytics.priceDrop,
                            priceIncrease: product.ProductAnalytics.priceIncrease,
                            percentageChange: product.ProductAnalytics.percentageChange,
                            isBuyRecommended: product.ProductAnalytics.isBuyRecommended,
                            isOnSale: product.ProductAnalytics.isOnSale,
                            previousPrice: product.ProductAnalytics.previousPrice,
                            priceChangeStatus: product.ProductAnalytics.priceChangeStatus,
                            averagePrice: product.ProductAnalytics.averagePrice,
                            medianPrice: product.ProductAnalytics.medianPrice,
                            priceStdDev: product.ProductAnalytics.priceStdDev,
                            promotionImpact: product.ProductAnalytics.promotionImpact,
                            lastCalculated: product.ProductAnalytics.lastCalculated,
                        } : null,
                    },
                };
            })
        );

        // Filter out any null results (products not found)
        return favoriteProducts.filter(product => product !== null);



    }


    async isFavorite(userId: string, productId: string): Promise<boolean> {
        const favorite = await this.prisma.favorite.findFirst({
            where: {
                userId,
                productId,
            },
        });
        return favorite !== null;
    }



}
