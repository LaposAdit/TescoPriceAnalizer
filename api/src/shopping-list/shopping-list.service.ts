import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ShoppingListDTO, ShoppingListItemDTO, AddToShoppingListResponseDTO, ShoppingListDeleteResponseDTO, UpdateShoppingListSharingDTO } from 'src/dto/ShopingListDTO';
import { ProductCategory } from 'src/enum/product-category.enum';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ShoppingListService {
    constructor(private readonly prisma: PrismaService) { }

    async createShoppingList(dto: ShoppingListDTO) {
        return this.prisma.shoppingList.create({
            data: {
                name: dto.name,
                userId: dto.userId,
            },
        });
    }

    async addItemToShoppingList(dto: ShoppingListItemDTO): Promise<AddToShoppingListResponseDTO> {
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
            } else {
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
                    category: result.category as ProductCategory,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                },
            };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
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

    async removeItemFromShoppingList(shoppingListId: number, productId: string) {
        return this.prisma.shoppingListItem.deleteMany({
            where: {
                shoppingListId,
                productId,
            },
        });
    }

    async deleteShoppingList(id: number): Promise<ShoppingListDeleteResponseDTO> {
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

            // Delete all items in the shopping list
            if (itemsCount > 0) {
                await this.prisma.shoppingListItem.deleteMany({
                    where: { shoppingListId: id }
                });
            }

            // Delete the shopping list
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
        } catch (error) {
            return {
                success: false,
                message: `An error occurred while deleting the shopping list: ${error.message}`,
            };
        }
    }

    async getShoppingListById(id: number) {
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
            throw new NotFoundException(`Shopping list with id ${id} not found`);
        }

        return this.getDetailedShoppingList(shoppingList);
    }

    async getShoppingListsByUserId(userId: string) {
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

        return Promise.all(
            shoppingLists.map(async (list) => {
                const detailedList = await this.getDetailedShoppingList(list);
                return {
                    ...detailedList,
                    shared: list.shared,
                    sharedUrlId: list.sharedUrlId,
                };
            })
        );
    }

    private async getDetailedShoppingList(shoppingList: any) {
        if (!shoppingList || !shoppingList.items) {
            throw new NotFoundException(`Shopping list not found or has no items`);
        }

        const itemsWithProducts = await Promise.all(
            shoppingList.items.map(async (item: any) => {
                const modelName = this.getModelName(item.category as ProductCategory);
                const model = this.prisma[modelName];
                const product = await model.findFirst({
                    where: { productId: item.productId },
                    orderBy: { lastUpdated: 'desc' }, // Order by last updated to get the latest product
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
                        promotions: {
                            select: {
                                promotionId: true,
                                promotionType: true,
                                startDate: true,
                                endDate: true,
                                offerText: true,
                                attributes: true,
                                promotionPrice: true
                            }
                        },
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

        const validItemsWithProducts = itemsWithProducts.filter(item => item !== null);

        return { ...shoppingList, items: validItemsWithProducts };
    }






    async getShoppingListSummariesByUserId(userId: string) {
        return this.prisma.shoppingList.findMany({
            where: { userId },
            select: {
                id: true,
                name: true,
                shared: true,
                sharedUrlId: true,
            },
        });
    }

    async updateShoppingListSharing(id: number, userId: string, shared: boolean) {
        const shoppingList = await this.prisma.shoppingList.findFirst({
            where: { id, userId }
        });

        if (!shoppingList) {
            throw new NotFoundException(`Shopping list with id ${id} not found or you do not have permission to update it.`);
        }

        const sharedUrlId = shared ? this.generateSharedUrlId() : null;

        return this.prisma.shoppingList.update({
            where: { id },
            data: {
                shared,
                sharedUrlId
            },
        });
    }

    private generateSharedUrlId(): string {
        const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let sharedUrlId = '';
        for (let i = 0; i < 13; i++) {
            sharedUrlId += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        }
        return sharedUrlId;
    }

    async getShoppingListBySharedUrlId(sharedUrlId: string) {
        const shoppingList = await this.prisma.shoppingList.findUnique({
            where: { sharedUrlId },
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
            throw new NotFoundException(`Shopping list with sharedUrlId ${sharedUrlId} not found`);
        }

        return this.getDetailedShoppingList(shoppingList);
    }

    private getModelName(category: ProductCategory): string {
        const modelMapping: Record<ProductCategory, string> = {
            [ProductCategory.TrvanlivePotraviny]: 'trvanlivePotraviny',
            [ProductCategory.SpecialnaAZdravaVyziva]: 'specialnaAZdravaVyziva',
            [ProductCategory.Pecivo]: 'pecivo',
            [ProductCategory.OvocieAZeleniny]: 'ovocieAZeleniny',
            [ProductCategory.Napoje]: 'napoje',
            [ProductCategory.MrazenePotraviny]: 'mrazenePotraviny',
            [ProductCategory.MliecneVyrobkyAVajcia]: 'mliecneVyrobkyAVajcia',
            [ProductCategory.MasoRybyALahodky]: 'masoRybyALahodky',
            [ProductCategory.Grilovanie]: 'grilovanie',
            [ProductCategory.Alkohol]: 'alkohol',
            [ProductCategory.StarostlivostODomacnost]: 'starostlivostODomacnost',
            [ProductCategory.ZdravieAKrasa]: 'zdravieAKrasa',
        };

        return modelMapping[category];
    }
}
