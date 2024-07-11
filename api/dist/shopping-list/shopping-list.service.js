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
exports.ShoppingListService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const product_category_enum_1 = require("../enum/product-category.enum");
const library_1 = require("@prisma/client/runtime/library");
let ShoppingListService = class ShoppingListService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createShoppingList(dto) {
        return this.prisma.shoppingList.create({
            data: {
                name: dto.name,
                userId: dto.userId,
            },
        });
    }
    async addItemToShoppingList(dto) {
        try {
            const shoppingList = await this.prisma.shoppingList.findUnique({
                where: { id: dto.shoppingListId }
            });
            if (!shoppingList) {
                return {
                    success: false,
                    message: `Shopping list with id ${dto.shoppingListId} not found. Please create a shopping list first.`,
                    data: null
                };
            }
            const modelName = this.getModelName(dto.category);
            const model = this.prisma[modelName];
            const productExists = await model.findFirst({
                where: {
                    productId: dto.productId,
                },
            });
            if (!productExists) {
                return {
                    success: false,
                    message: `Product with id ${dto.productId} not found`,
                    data: null
                };
            }
            const existingItem = await this.prisma.shoppingListItem.findUnique({
                where: {
                    shoppingListId_productId: {
                        shoppingListId: dto.shoppingListId,
                        productId: dto.productId,
                    },
                },
            });
            let result;
            let action;
            if (existingItem) {
                result = await this.prisma.shoppingListItem.update({
                    where: {
                        shoppingListId_productId: {
                            shoppingListId: dto.shoppingListId,
                            productId: dto.productId,
                        },
                    },
                    data: {
                        quantity: existingItem.quantity + dto.quantity,
                    },
                    include: {
                        shoppingList: true,
                    },
                });
                action = 'updated';
            }
            else {
                result = await this.prisma.shoppingListItem.create({
                    data: {
                        shoppingListId: dto.shoppingListId,
                        productId: dto.productId,
                        quantity: dto.quantity,
                        category: dto.category,
                    },
                    include: {
                        shoppingList: true,
                    },
                });
                action = 'added';
            }
            return {
                success: true,
                message: `Item successfully ${action} to shopping list`,
                data: {
                    id: result.id,
                    shoppingListId: result.shoppingListId,
                    shoppingListName: result.shoppingList.name,
                    productId: result.productId,
                    quantity: result.quantity,
                    category: result.category,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                },
            };
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    return {
                        success: false,
                        message: `Shopping list with id ${dto.shoppingListId} not found. Please create a shopping list first.`,
                        data: null
                    };
                }
            }
            return {
                success: false,
                message: 'Failed to add item to shopping list',
                error: error.message,
                data: null
            };
        }
    }
    async removeItemFromShoppingList(shoppingListId, productId) {
        return this.prisma.shoppingListItem.deleteMany({
            where: {
                shoppingListId,
                productId,
            },
        });
    }
    async deleteShoppingList(id) {
        try {
            const shoppingList = await this.prisma.shoppingList.findUnique({
                where: { id },
                include: { items: true }
            });
            if (!shoppingList) {
                return {
                    success: false,
                    message: `Shopping list with id ${id} not found`,
                };
            }
            const itemsCount = shoppingList.items.length;
            if (itemsCount > 0) {
                await this.prisma.shoppingListItem.deleteMany({
                    where: { shoppingListId: id }
                });
            }
            await this.prisma.shoppingList.delete({
                where: { id }
            });
            return {
                success: true,
                message: 'Shopping list successfully deleted',
                data: {
                    id,
                    itemsDeleted: itemsCount,
                },
            };
        }
        catch (error) {
            return {
                success: false,
                message: `An error occurred while deleting the shopping list: ${error.message}`,
            };
        }
    }
    async getShoppingListById(id) {
        const shoppingList = await this.prisma.shoppingList.findUnique({
            where: { id },
            include: {
                items: {
                    select: {
                        id: true,
                        shoppingListId: true,
                        productId: true,
                        quantity: true,
                        category: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                }
            },
        });
        if (!shoppingList) {
            throw new common_1.NotFoundException(`Shopping list with id ${id} not found`);
        }
        return this.getDetailedShoppingList(shoppingList);
    }
    async getShoppingListsByUserId(userId) {
        const shoppingLists = await this.prisma.shoppingList.findMany({
            where: { userId },
            include: {
                items: {
                    select: {
                        id: true,
                        shoppingListId: true,
                        productId: true,
                        quantity: true,
                        category: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                }
            },
        });
        return Promise.all(shoppingLists.map(list => this.getDetailedShoppingList(list)));
    }
    async getDetailedShoppingList(shoppingList) {
        if (!shoppingList || !shoppingList.items) {
            throw new common_1.NotFoundException(`Shopping list not found or has no items`);
        }
        const itemsWithProducts = await Promise.all(shoppingList.items.map(async (item) => {
            const modelName = this.getModelName(item.category);
            const model = this.prisma[modelName];
            const product = await model.findFirst({
                where: { productId: item.productId },
                select: {
                    id: true,
                    productId: true,
                    title: true,
                    price: true,
                    unitPrice: true,
                    imageUrl: true,
                    unitOfMeasure: true,
                    isForSale: true,
                    aisleName: true,
                    superDepartmentName: true,
                    hasPromotions: true,
                    lastUpdated: true,
                    promotions: true,
                    ProductAnalytics: {
                        select: {
                            id: true,
                            productId: true,
                            priceDrop: true,
                            priceIncrease: true,
                            percentageChange: true,
                            isBuyRecommended: true,
                            isOnSale: true,
                            previousPrice: true,
                            priceChangeStatus: true,
                            averagePrice: true,
                            medianPrice: true,
                            priceStdDev: true,
                            promotionImpact: true,
                            lastCalculated: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    },
                },
            });
            if (!product) {
                return null;
            }
            return {
                ...item,
                product: {
                    dbId: product.id,
                    productId: product.productId,
                    title: product.title,
                    price: product.price,
                    unitPrice: product.unitPrice,
                    imageUrl: product.imageUrl,
                    unitOfMeasure: product.unitOfMeasure,
                    isForSale: product.isForSale,
                    aisleName: product.aisleName,
                    superDepartmentName: product.superDepartmentName,
                    category: item.category,
                    promotions: product.promotions,
                    hasPromotions: product.hasPromotions,
                    lastUpdated: product.lastUpdated,
                    analytics: product.ProductAnalytics,
                },
            };
        }));
        const validItemsWithProducts = itemsWithProducts.filter(item => item !== null);
        return { ...shoppingList, items: validItemsWithProducts };
    }
    async getShoppingListSummariesByUserId(userId) {
        return this.prisma.shoppingList.findMany({
            where: { userId },
            select: {
                id: true,
                name: true,
            },
        });
    }
    getModelName(category) {
        const modelMapping = {
            [product_category_enum_1.ProductCategory.TrvanlivePotraviny]: 'trvanlivePotraviny',
            [product_category_enum_1.ProductCategory.SpecialnaAZdravaVyziva]: 'specialnaAZdravaVyziva',
            [product_category_enum_1.ProductCategory.Pecivo]: 'pecivo',
            [product_category_enum_1.ProductCategory.OvocieAZeleniny]: 'ovocieAZeleniny',
            [product_category_enum_1.ProductCategory.Napoje]: 'napoje',
            [product_category_enum_1.ProductCategory.MrazenePotraviny]: 'mrazenePotraviny',
            [product_category_enum_1.ProductCategory.MliecneVyrobkyAVajcia]: 'mliecneVyrobkyAVajcia',
            [product_category_enum_1.ProductCategory.MasoRybyALahodky]: 'masoRybyALahodky',
            [product_category_enum_1.ProductCategory.Grilovanie]: 'grilovanie',
            [product_category_enum_1.ProductCategory.Alkohol]: 'alkohol',
            [product_category_enum_1.ProductCategory.StarostlivostODomacnost]: 'starostlivostODomacnost',
            [product_category_enum_1.ProductCategory.ZdravieAKrasa]: 'zdravieAKrasa',
        };
        return modelMapping[category];
    }
};
exports.ShoppingListService = ShoppingListService;
exports.ShoppingListService = ShoppingListService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShoppingListService);
//# sourceMappingURL=shopping-list.service.js.map