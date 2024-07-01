import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TescoService {
    constructor(private readonly prisma: PrismaService) { }


    private transformProduct(product: any): any {
        return {
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
            category: product.category,
            promotions: product.promotions.map((promo: any) => ({
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
        };
    }

    private transformProductWithAnalytics(product: any, analytics: any): any {
        return {
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
            category: product.category,
            promotions: product.promotions.map((promo: any) => ({
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
            analytics: analytics
        };
    }

    private getPrismaModel(category: string) {
        const modelMapping: Record<string, any> = {
            trvanlivePotraviny: this.prisma.trvanlivePotraviny,
            specialnaAZdravaVyziva: this.prisma.specialnaAZdravaVyziva,
            pecivo: this.prisma.pecivo,
            ovocieAZeleniny: this.prisma.ovocieAZeleniny,
            napoje: this.prisma.napoje,
            mrazenePotraviny: this.prisma.mrazenePotraviny,
            mliecneVyrobkyAVajcia: this.prisma.mliecneVyrobkyAVajcia,
            masoRybyALahodky: this.prisma.masoRybyALahodky,
            grilovanie: this.prisma.grilovanie,
            alkohol: this.prisma.alkohol,
        };

        const model = modelMapping[category];
        if (!model) {
            throw new NotFoundException(`Model for category ${category} not found`);
        }

        return model;
    }

    private createWhereClause(sale?: boolean) {
        const where: Record<string, any> = {};
        if (sale !== undefined) {
            where['hasPromotions'] = sale;
        }
        return where;
    }
    async getProducts(
        category: string,
        page: number,
        pageSize: number,
        sale?: boolean
    ): Promise<any> {
        const skip = (page - 1) * pageSize;
        const take = Number(pageSize);
        const allCategories = [
            'trvanlivePotraviny', 'specialnaAZdravaVyziva', 'pecivo', 'ovocieAZeleniny',
            'napoje', 'mrazenePotraviny', 'mliecneVyrobkyAVajcia', 'masoRybyALahodky',
            'grilovanie', 'alkohol',
        ];
        const availableCategories: Set<string> = new Set(allCategories);

        const fetchLatestProducts = async (model: any, where: any, skip: number, take: number, category: string) => {
            const latestProducts = await model.findMany({
                where,
                skip,
                take,
                include: { promotions: true },
                orderBy: { lastUpdated: 'desc' },
                distinct: ['productId'],
            });

            return latestProducts.map(product => this.transformProduct({ ...product, category }));
        };

        if (category === 'all') {
            const models: Array<{ model: keyof PrismaService, category: string }> = [
                { model: 'trvanlivePotraviny', category: 'trvanlivePotraviny' },
                { model: 'specialnaAZdravaVyziva', category: 'specialnaAZdravaVyziva' },
                { model: 'pecivo', category: 'pecivo' },
                { model: 'ovocieAZeleniny', category: 'ovocieAZeleniny' },
                { model: 'napoje', category: 'napoje' },
                { model: 'mrazenePotraviny', category: 'mrazenePotraviny' },
                { model: 'mliecneVyrobkyAVajcia', category: 'mliecneVyrobkyAVajcia' },
                { model: 'masoRybyALahodky', category: 'masoRybyALahodky' },
                { model: 'grilovanie', category: 'grilovanie' },
                { model: 'alkohol', category: 'alkohol' },
            ];

            let allResults: any[] = [];
            let totalProducts = 0;

            for (const { model, category } of models) {
                const where = this.createWhereClause(sale);
                const modelInstance = this.prisma[model] as any;

                const categoryProducts = await fetchLatestProducts(modelInstance, where, skip, take, category);
                totalProducts += categoryProducts.length;
                allResults.push(...categoryProducts);
            }

            const totalPages = Math.ceil(totalProducts / pageSize);
            const paginatedProducts = allResults.slice(0, take); // Only take the first 'take' number of products

            return {
                totalPages,
                totalProducts,
                products: paginatedProducts,
                availableCategories: Array.from(availableCategories),
            };
        } else {
            const model = this.getPrismaModel(category);
            const where = this.createWhereClause(sale);

            const products = await fetchLatestProducts(model, where, skip, take, category);
            const totalProducts = products.length;
            const totalPages = Math.ceil(totalProducts / pageSize);

            return {
                totalPages,
                totalProducts,
                products,
                availableCategories: Array.from(availableCategories),
            };
        }
    }

    async getProductById(category: string, productId: string): Promise<any[]> {
        const model = this.getPrismaModel(category);
        const productsFromDb = await model.findMany({
            where: { productId },
            include: { promotions: true },
            orderBy: { lastUpdated: 'desc' }
        });

        return productsFromDb.map(product => ({
            dbId: product.id, // Add dbId here
            productId: product.productId,
            title: product.title,
            price: product.price,
            unitPrice: product.unitPrice,
            imageUrl: product.imageUrl,
            unitOfMeasure: product.unitOfMeasure,
            isForSale: product.isForSale,
            aisleName: product.aisleName,
            superDepartmentName: product.superDepartmentName,
            category,
            promotions: product.promotions.map(promo => ({
                promotionId: promo.promotionId,
                promotionType: promo.promotionType,
                startDate: promo.startDate.toISOString(),
                endDate: promo.endDate.toISOString(),
                offerText: promo.offerText,
                attributes: promo.attributes,
                promotionPrice: promo.promotionPrice, // Include promotionPrice here
            })),
            hasPromotions: product.promotions.length > 0,
            lastUpdated: product.lastUpdated,
        }));
    }

    private async searchModelForTerm(model: any, searchTerm: string, sale?: boolean, category?: string) {
        const where: Record<string, any> = {
            title: {
                contains: searchTerm,
                mode: 'insensitive',
            },
        };
        if (sale !== undefined) {
            where['hasPromotions'] = sale;
        }

        const results = await model.findMany({
            where,
            include: { promotions: true },
            orderBy: { lastUpdated: 'desc' }
        });

        return results.map((product: any) => ({
            ...product,
            category
        }));
    }

    async searchProductsByName(searchTerm: string, page: number, pageSize: number, sale?: boolean, category?: string): Promise<any> {
        const allCategories = [
            'trvanlivePotraviny',
            'specialnaAZdravaVyziva',
            'pecivo',
            'ovocieAZeleniny',
            'napoje',
            'mrazenePotraviny',
            'mliecneVyrobkyAVajcia',
            'masoRybyALahodky',
            'grilovanie',
            'alkohol',
        ];
        const availableCategories: Set<string> = new Set(allCategories);

        let models;

        if (category) {
            models = [{ model: this.getPrismaModel(category), category }];
        } else {
            models = [
                { model: this.prisma.trvanlivePotraviny, category: 'trvanlivePotraviny' },
                { model: this.prisma.specialnaAZdravaVyziva, category: 'specialnaAZdravaVyziva' },
                { model: this.prisma.pecivo, category: 'pecivo' },
                { model: this.prisma.ovocieAZeleniny, category: 'ovocieAZeleniny' },
                { model: this.prisma.napoje, category: 'napoje' },
                { model: this.prisma.mrazenePotraviny, category: 'mrazenePotraviny' },
                { model: this.prisma.mliecneVyrobkyAVajcia, category: 'mliecneVyrobkyAVajcia' },
                { model: this.prisma.masoRybyALahodky, category: 'masoRybyALahodky' },
                { model: this.prisma.grilovanie, category: 'grilovanie' },
                { model: this.prisma.alkohol, category: 'alkohol' },
            ];
        }

        const searchPromises = models.map(({ model, category }) => this.searchModelForTerm(model, searchTerm, sale, category));

        const searchResults = await Promise.all(searchPromises);
        const productsFromDb = searchResults.flat();

        const totalProducts = productsFromDb.length;
        const totalPages = Math.ceil(totalProducts / pageSize);
        const skip = (page - 1) * pageSize;

        const paginatedProducts = productsFromDb.slice(skip, skip + pageSize);

        const transformedProducts = paginatedProducts.map((product: any) => ({
            dbId: product.id, // Add dbId here
            productId: product.productId,
            title: product.title,
            price: product.price,
            unitPrice: product.unitPrice,
            imageUrl: product.imageUrl,
            unitOfMeasure: product.unitOfMeasure,
            isForSale: product.isForSale,
            aisleName: product.aisleName,
            superDepartmentName: product.superDepartmentName,
            category: product.category,
            promotions: product.promotions.map((promo: any) => ({
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
        }));

        return {
            totalPages,
            totalProducts,
            products: transformedProducts,
            availableCategories: Array.from(availableCategories),
        };
    }

    async getProductsAnalytics(
        category: string,
        page: number,
        pageSize: number,
        sale?: boolean
    ): Promise<any> {
        const skip = (page - 1) * pageSize;
        const take = Number(pageSize);
        const allCategories = [
            'trvanlivePotraviny', 'specialnaAZdravaVyziva', 'pecivo', 'ovocieAZeleniny',
            'napoje', 'mrazenePotraviny', 'mliecneVyrobkyAVajcia', 'masoRybyALahodky',
            'grilovanie', 'alkohol',
        ];
        const availableCategories: Set<string> = new Set(allCategories);

        const fetchProductsWithAnalytics = async (model: any, where: any, skip: number, take: number, category: string) => {
            const latestProducts = await model.findMany({
                where,
                skip,
                take,
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
                    promotions: {
                        select: {
                            promotionId: true,
                            promotionType: true,
                            startDate: true,
                            endDate: true,
                            offerText: true,
                            attributes: true,
                            promotionPrice: true,
                        },
                    },
                    lastUpdated: true,
                },
                orderBy: { lastUpdated: 'desc' },
                distinct: ['productId'],
            });

            const productPromises = latestProducts.map(async (product: any) => {
                try {
                    const productHistory = await model.findMany({
                        where: { productId: product.productId },
                        select: {
                            id: true,
                            price: true,
                            unitPrice: true,
                            promotions: {
                                select: {
                                    promotionId: true,
                                    promotionType: true,
                                    startDate: true,
                                    endDate: true,
                                    offerText: true,
                                    attributes: true,
                                    promotionPrice: true,
                                },
                            },
                            lastUpdated: true,
                        },
                        orderBy: { lastUpdated: 'desc' },
                    });

                    const analytics = this.calculateAnalytics(productHistory);
                    return this.transformProductWithAnalytics({ ...product, category }, analytics);
                } catch (error) {
                    console.error(`Error processing product ${product.productId}:`, error);
                    return this.transformProductWithAnalytics({ ...product, category }, null);
                }
            });

            const productsWithAnalytics = await Promise.all(productPromises);

            return productsWithAnalytics;
        };

        if (category === 'all') {
            const models: Array<{ model: keyof PrismaService, category: string }> = [
                { model: 'trvanlivePotraviny', category: 'trvanlivePotraviny' },
                { model: 'specialnaAZdravaVyziva', category: 'specialnaAZdravaVyziva' },
                { model: 'pecivo', category: 'pecivo' },
                { model: 'ovocieAZeleniny', category: 'ovocieAZeleniny' },
                { model: 'napoje', category: 'napoje' },
                { model: 'mrazenePotraviny', category: 'mrazenePotraviny' },
                { model: 'mliecneVyrobkyAVajcia', category: 'mliecneVyrobkyAVajcia' },
                { model: 'masoRybyALahodky', category: 'masoRybyALahodky' },
                { model: 'grilovanie', category: 'grilovanie' },
                { model: 'alkohol', category: 'alkohol' },
            ];

            let allResults: any[] = [];
            let totalProducts = 0;

            for (const { model, category } of models) {
                const where = this.createWhereClause(sale);
                const modelInstance = this.prisma[model] as any;

                const distinctProductIds = await modelInstance.findMany({
                    where,
                    select: { productId: true },
                    distinct: ['productId'],
                });
                totalProducts += distinctProductIds.length;

                const categoryProducts = await fetchProductsWithAnalytics(modelInstance, where, skip, take, category);
                allResults.push(...categoryProducts);
            }

            const totalPages = Math.ceil(totalProducts / pageSize);
            const paginatedProducts = allResults.slice(skip, skip + take);

            return {
                totalPages,
                totalProducts,
                products: paginatedProducts,
                availableCategories: Array.from(availableCategories),
            };
        } else {
            const model = this.getPrismaModel(category);
            const where = this.createWhereClause(sale);

            const distinctProductIds = await model.findMany({
                where,
                select: { productId: true },
                distinct: ['productId'],
            });
            const totalProducts = distinctProductIds.length;
            const totalPages = Math.ceil(totalProducts / pageSize);

            const products = await fetchProductsWithAnalytics(model, where, skip, take, category);

            return {
                totalPages,
                totalProducts,
                products,
                availableCategories: Array.from(availableCategories),
            };
        }
    }


    private calculateAnalytics(products: any[]): any {
        if (products.length < 2) {
            return {
                priceDrop: 0,
                priceIncrease: 0,
                percentageChange: 0,
                isBuyRecommended: 'neutral',
                isOnSale: false,
                previousPrice: null,
                priceChangeStatus: 'unknown',
                averagePrice: null
            };
        }

        const getCurrentPrice = (product: any): number | null => {
            if (product.promotions && product.promotions.length > 0 && product.promotions[0].promotionPrice != null) {
                return product.promotions[0].promotionPrice;
            }
            return product.price != null ? product.price : null;
        };

        const currentProduct = products[0];
        const previousProduct = products[1];

        const currentPrice = getCurrentPrice(currentProduct);
        const previousPrice = getCurrentPrice(previousProduct);

        // Calculate average price
        const validPrices = products
            .map(getCurrentPrice)
            .filter((price): price is number => price !== null);
        const averagePrice = validPrices.length > 0
            ? parseFloat((validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length).toFixed(2))
            : null;

        if (currentPrice === null || previousPrice === null) {
            return {
                priceDrop: 0,
                priceIncrease: 0,
                percentageChange: 0,
                isBuyRecommended: 'neutral',
                isOnSale: currentProduct.promotions && currentProduct.promotions.length > 0,
                previousPrice: previousPrice,
                priceChangeStatus: 'unknown',
                averagePrice: averagePrice
            };
        }

        const priceDifference = previousPrice - currentPrice;
        const percentageChange = (priceDifference / previousPrice) * 100;

        const isOnSale = currentProduct.promotions && currentProduct.promotions.length > 0;

        let priceChangeStatus: 'decreased' | 'increased' | 'unchanged' = 'unchanged';
        if (priceDifference > 0) {
            priceChangeStatus = 'decreased';
        } else if (priceDifference < 0) {
            priceChangeStatus = 'increased';
        }

        let isBuyRecommended: 'yes' | 'no' | 'neutral' = 'neutral';
        if (priceDifference > 0) {
            isBuyRecommended = 'yes';
        } else if (priceDifference < 0) {
            isBuyRecommended = 'no';
        } else if (isOnSale) {
            isBuyRecommended = 'yes';
        }

        // Compare current price to average price for buy recommendation
        if (averagePrice !== null && currentPrice < averagePrice) {
            isBuyRecommended = 'yes';
        }

        return {
            priceDrop: priceDifference > 0 ? parseFloat(priceDifference.toFixed(2)) : 0,
            priceIncrease: priceDifference < 0 ? parseFloat(Math.abs(priceDifference).toFixed(2)) : 0,
            percentageChange: parseFloat(percentageChange.toFixed(2)),
            isBuyRecommended: isBuyRecommended,
            isOnSale: isOnSale,
            previousPrice: parseFloat(previousPrice.toFixed(2)),
            priceChangeStatus: priceChangeStatus,
            averagePrice: averagePrice
        };
    }



}




