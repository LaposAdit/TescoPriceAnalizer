"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const product_category_enum_1 = require("../enum/product-category.enum");
let FavoriteService = class FavoriteService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addFavorite(userId, productId, category) {
        return this.prisma.favorite.create({
            data: {
                userId,
                productId,
                category: category,
            },
        });
    }
    async removeFavorite(userId, productId) {
        return this.prisma.favorite.deleteMany({
            where: {
                userId,
                productId,
            },
        });
    }
    getPrismaModel(category) {
        const modelMapping = {
            [product_category_enum_1.ProductCategory.TrvanlivePotraviny]: this.prisma.trvanlivePotraviny,
            [product_category_enum_1.ProductCategory.SpecialnaAZdravaVyziva]: this.prisma.specialnaAZdravaVyziva,
            [product_category_enum_1.ProductCategory.Pecivo]: this.prisma.pecivo,
            [product_category_enum_1.ProductCategory.OvocieAZeleniny]: this.prisma.ovocieAZeleniny,
            [product_category_enum_1.ProductCategory.Napoje]: this.prisma.napoje,
            [product_category_enum_1.ProductCategory.MrazenePotraviny]: this.prisma.mrazenePotraviny,
            [product_category_enum_1.ProductCategory.MliecneVyrobkyAVajcia]: this.prisma.mliecneVyrobkyAVajcia,
            [product_category_enum_1.ProductCategory.MasoRybyALahodky]: this.prisma.masoRybyALahodky,
            [product_category_enum_1.ProductCategory.Grilovanie]: this.prisma.grilovanie,
            [product_category_enum_1.ProductCategory.Alkohol]: this.prisma.alkohol,
            [product_category_enum_1.ProductCategory.StarostlivostODomacnost]: this.prisma.starostlivostODomacnost,
        };
        return modelMapping[category];
    }
    async getFavorites(userId) {
        const favorites = await this.prisma.favorite.findMany({
            where: { userId },
        });
        const favoriteProducts = await Promise.all(favorites.map(async (favorite) => {
            const model = this.getPrismaModel(favorite.category);
            const product = await model.findFirst({
                where: { productId: favorite.productId },
                include: {
                    promotions: true,
                    ProductAnalytics: true
                },
                orderBy: { lastUpdated: 'desc' }
            });
            if (!product) {
                return null;
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
        }));
        return favoriteProducts.filter(product => product !== null);
    }
    async isFavorite(userId, productId) {
        const favorite = await this.prisma.favorite.findFirst({
            where: {
                userId,
                productId,
            },
        });
        return favorite !== null;
    }
};
exports.FavoriteService = FavoriteService;
exports.FavoriteService = FavoriteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FavoriteService);
//# sourceMappingURL=favorite.service.js.map