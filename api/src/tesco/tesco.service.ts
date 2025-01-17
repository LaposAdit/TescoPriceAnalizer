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
            starostlivostODomacnost: this.prisma.starostlivostODomacnost,
            zdravieAKrasa: this.prisma.zdravieAKrasa,
        };

        const model = modelMapping[category];
        if (!model) {
            throw new NotFoundException(`Model for category ${category} not found`);
        }

        return model;
    }


    async getProducts(
        category: string,
        page: number,
        pageSize: number,
        sale?: boolean,
        randomize?: boolean
    ): Promise<any> {
        console.log(`Fetching products for category: ${category}, page: ${page}, pageSize: ${pageSize}, sale: ${sale}, randomize: ${randomize}`);

        const skip = (page - 1) * pageSize;
        const take = Number(pageSize);
        const allCategories = [
            'trvanlivePotraviny', 'specialnaAZdravaVyziva', 'pecivo', 'ovocieAZeleniny',
            'napoje', 'mrazenePotraviny', 'mliecneVyrobkyAVajcia', 'masoRybyALahodky',
            'grilovanie', 'alkohol', 'starostlivostODomacnost', 'zdravieAKrasa',
        ];
        const availableCategories: Set<string> = new Set(allCategories);

        const fetchLatestProducts = async (model: any, category: string, sale?: boolean) => {
            let whereClause = {};
            if (sale === true) {
                whereClause = { hasPromotions: true };
            } else if (sale === false) {
                whereClause = { hasPromotions: false };
            }
            // If sale is undefined, we don't add any condition to whereClause

            // Find the most recent date
            const latestDate = await model.findFirst({
                where: whereClause,
                orderBy: { lastUpdated: 'desc' },
                select: { lastUpdated: true },
            });

            if (!latestDate) {
                console.log(`No products found for category: ${category} with sale filter: ${sale}`);
                return { products: [], totalCount: 0 };
            }

            // Fetch products from the latest date
            const products = await model.findMany({
                where: {
                    ...whereClause,
                    lastUpdated: {
                        gte: new Date(latestDate.lastUpdated.toDateString()),  // Start of the day
                        lt: new Date(new Date(latestDate.lastUpdated).setDate(latestDate.lastUpdated.getDate() + 1))  // Start of the next day
                    },
                },
                include: { promotions: true },
                orderBy: { productId: 'asc' },
            });

            console.log(`Fetched ${products.length} latest products for category: ${category} with sale filter: ${sale}`);

            return {
                products: products.map(product => this.transformProduct({ ...product, category })),
                totalCount: products.length,
            };
        };

        let totalProducts = 0;
        let products: any[] = [];

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
                { model: 'starostlivostODomacnost', category: 'starostlivostODomacnost' },
                { model: 'zdravieAKrasa', category: 'zdravieAKrasa' }
            ];

            const allProductsPromises = models.map(async ({ model, category }) => {
                const modelInstance = this.prisma[model] as any;
                const result = await fetchLatestProducts(modelInstance, category, sale);
                totalProducts += result.totalCount;
                return result.products;
            });

            const allProducts = (await Promise.all(allProductsPromises)).flat();
            console.log(`Total products fetched for all categories: ${allProducts.length}`);

            if (randomize) {
                products = allProducts.sort(() => Math.random() - 0.5).slice(skip, skip + take);
            } else {
                products = allProducts.sort((a, b) => a.productId.localeCompare(b.productId)).slice(skip, skip + take);
            }

            totalProducts = allProducts.length;
        } else {
            const model = this.getPrismaModel(category);
            const result = await fetchLatestProducts(model, category, sale);
            totalProducts = result.totalCount;
            products = result.products;

            if (randomize) {
                products.sort(() => Math.random() - 0.5);
            }

            // Apply pagination for single category
            products = products.slice(skip, skip + take);
        }

        console.log(`Final number of products: ${products.length}`);
        console.log(`Total products: ${totalProducts}`);

        const totalPages = Math.ceil(totalProducts / pageSize);

        return {
            totalPages,
            totalProducts,
            products,
            availableCategories: Array.from(availableCategories),
        };
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








    async searchProductsByName(searchTerm: string, page: number, pageSize: number, sale?: boolean, category?: string): Promise<any> {
        const allCategories = [
            'trvanlivePotraviny', 'specialnaAZdravaVyziva', 'pecivo', 'ovocieAZeleniny',
            'napoje', 'mrazenePotraviny', 'mliecneVyrobkyAVajcia', 'masoRybyALahodky',
            'grilovanie', 'alkohol', 'starostlivostODomacnost', 'zdravieAKrasa',
        ];
        const availableCategories: Set<string> = new Set(allCategories);

        let models;

        if (category) {
            models = [{ model: this.getPrismaModel(category), category }];
        } else {
            models = allCategories.map(cat => ({ model: this.getPrismaModel(cat), category: cat }));
        }

        const searchLatestProducts = async (model: any, searchTerm: string, sale?: boolean, category?: string) => {
            // First, get the latest products matching the search term
            const latestProductsQuery = await model.groupBy({
                by: ['productId'],
                where: {
                    title: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                _max: {
                    lastUpdated: true,
                },
            });

            // Then, fetch the full data for these latest products
            const latestProducts = await Promise.all(
                latestProductsQuery.map(async (item: any) => {
                    const product = await model.findFirst({
                        where: {
                            productId: item.productId,
                            lastUpdated: item._max.lastUpdated,
                        },
                        include: { promotions: true },
                    });
                    return product;
                })
            );

            // Apply sale filter if necessary
            let filteredProducts = latestProducts;
            if (sale !== undefined) {
                filteredProducts = latestProducts.filter(product =>
                    (sale && product.promotions.length > 0) || (!sale && product.promotions.length === 0)
                );
            }

            return filteredProducts.map(product =>
                this.transformProduct({ ...product, category })
            );
        };

        const searchPromises = models.map(({ model, category }) =>
            searchLatestProducts(model, searchTerm, sale, category)
        );

        const searchResults = await Promise.all(searchPromises);
        const allProducts = searchResults.flat();

        const totalProducts = allProducts.length;
        const totalPages = Math.ceil(totalProducts / pageSize);
        const skip = (page - 1) * pageSize;

        const paginatedProducts = allProducts.slice(skip, skip + pageSize);

        return {
            totalPages,
            totalProducts,
            products: paginatedProducts,
            availableCategories: Array.from(availableCategories),
        };
    }




    async calculateAndStoreAnalytics(category: string): Promise<void> {
        const model = this.getPrismaModel(category);
        const latestProducts = await model.findMany({
            orderBy: { lastUpdated: 'desc' },
            distinct: ['productId'],
            include: { promotions: true }
        });

        console.log(`Found ${latestProducts.length} products to process for category: ${category}`);

        const batchSize = 10;
        for (let i = 0; i < latestProducts.length; i += batchSize) {
            const batch = latestProducts.slice(i, i + batchSize);
            const batchPromises = batch.map(async (product, index) => {
                console.log(`Processing product ${i + index + 1} of ${latestProducts.length} - Product ID: ${product.productId}`);

                const history = await model.findMany({
                    where: { productId: product.productId },
                    orderBy: { lastUpdated: 'desc' },
                    take: 5,
                    include: { promotions: true }
                });

                // Log product data
                //console.log(`Product data: ${JSON.stringify(product)}`);

                const analytics = this.calculateAnalytics([product, ...history.slice(1)]);

                const updateData = {
                    ...analytics,
                    lastCalculated: new Date(),
                    updatedAt: new Date(),
                };

                const createData = {
                    productId: product.productId,
                    ...analytics,
                    lastCalculated: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                if (product.id) {
                    updateData[category] = { connect: { id: product.id } };
                    createData[category] = { connect: { id: product.id } };
                }

                try {
                    await this.prisma.productAnalytics.upsert({
                        where: { productId: product.productId },
                        update: updateData,
                        create: createData
                    });
                    console.log(`Successfully processed product ${i + index + 1} of ${latestProducts.length} - Product ID: ${product.productId}`);
                } catch (error) {
                    console.error(`Error processing product ${i + index + 1} of ${latestProducts.length} - Product ID: ${product.productId}`, error);
                }
            });

            await Promise.all(batchPromises);
        }
    }


    private calculateAnalytics(products: any[]): any {
        const currentProduct = products[0];
        const isOnSale = currentProduct.hasPromotions;

        const getEffectivePrice = (product: any): number => {
            if (product.promotions && product.promotions.length > 0 && product.promotions[0].promotionPrice != null) {
                return product.promotions[0].promotionPrice;
            }
            return product.price;
        };

        const currentBasePrice = currentProduct.price;
        const currentEffectivePrice = getEffectivePrice(currentProduct);

        if (products.length < 2) {
            // If there's no previous data but the product is on sale
            if (isOnSale) {
                const priceDifference = currentBasePrice - currentEffectivePrice;
                const percentageChange = (priceDifference / currentBasePrice) * 100;

                return {
                    priceDrop: priceDifference > 0 ? parseFloat(priceDifference.toFixed(2)) : 0,
                    priceIncrease: priceDifference < 0 ? parseFloat(Math.abs(priceDifference).toFixed(2)) : 0,
                    percentageChange: parseFloat(percentageChange.toFixed(2)),
                    isBuyRecommended: 'yes',
                    isOnSale: true,
                    previousPrice: currentBasePrice,
                    priceChangeStatus: priceDifference > 0 ? 'decreased' : (priceDifference < 0 ? 'increased' : 'unchanged'),
                    averagePrice: currentBasePrice,
                    medianPrice: currentBasePrice,
                    priceStdDev: 0,
                    promotionImpact: parseFloat(priceDifference.toFixed(2))
                };
            }

            // If not on sale and no previous data, return default values
            return {
                priceDrop: 0,
                priceIncrease: 0,
                percentageChange: 0,
                isBuyRecommended: 'neutral',
                isOnSale: false,
                previousPrice: null,
                priceChangeStatus: 'unknown',
                averagePrice: null,
                medianPrice: null,
                priceStdDev: null,
                promotionImpact: null
            };
        }

        const previousEffectivePrice = getEffectivePrice(products[1]);

        let priceDifference: number;
        let percentageChange: number;

        if (isOnSale) {
            // If on sale, calculate difference from base price to sale price
            priceDifference = currentBasePrice - currentEffectivePrice;
            percentageChange = (priceDifference / currentBasePrice) * 100;
        } else {
            // If not on sale, calculate difference from previous price to current price
            priceDifference = previousEffectivePrice - currentEffectivePrice;
            percentageChange = (priceDifference / previousEffectivePrice) * 100;
        }

        const validPrices = products.slice(0, 5).map(getEffectivePrice);
        const averagePrice = validPrices.length > 0
            ? parseFloat((validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length).toFixed(2))
            : null;

        const medianPrice = validPrices.length > 0
            ? parseFloat(validPrices.sort((a, b) => a - b)[Math.floor(validPrices.length / 2)].toFixed(2))
            : null;

        const priceStdDev = validPrices.length > 0
            ? parseFloat(Math.sqrt(validPrices.map(price => Math.pow(price - averagePrice, 2)).reduce((sum, sq) => sum + sq, 0) / validPrices.length).toFixed(2))
            : null;

        let priceChangeStatus: 'decreased' | 'increased' | 'unchanged' = 'unchanged';
        if (priceDifference > 0) {
            priceChangeStatus = 'decreased';
        } else if (priceDifference < 0) {
            priceChangeStatus = 'increased';
        }

        let isBuyRecommended: 'yes' | 'no' | 'neutral' = 'neutral';
        if (priceDifference > 0 || (averagePrice !== null && currentEffectivePrice < averagePrice)) {
            isBuyRecommended = 'yes';
        } else if (priceDifference < 0) {
            isBuyRecommended = 'no';
        } else if (isOnSale) {
            isBuyRecommended = 'yes';
        }

        const promotionImpact = isOnSale ? parseFloat(priceDifference.toFixed(2)) : null;

        return {
            priceDrop: priceDifference > 0 ? parseFloat(priceDifference.toFixed(2)) : 0,
            priceIncrease: priceDifference < 0 ? parseFloat(Math.abs(priceDifference).toFixed(2)) : 0,
            percentageChange: parseFloat(percentageChange.toFixed(2)),
            isBuyRecommended,
            isOnSale,
            previousPrice: parseFloat(previousEffectivePrice.toFixed(2)),
            priceChangeStatus,
            averagePrice,
            medianPrice,
            priceStdDev,
            promotionImpact
        };
    }

    private calculateSalePriceDifference(product: any): number | null {
        if (product.promotions && product.promotions.length > 0 && product.promotions[0].promotionPrice != null) {
            const basePrice = product.price;
            const salePrice = product.promotions[0].promotionPrice;
            return parseFloat((basePrice - salePrice).toFixed(2));
        }
        return null;
    }

    async getProductsAnalytics(
        category: string,
        page: number,
        pageSize: number,
        sale?: boolean,
        randomize?: boolean,
        sortFields?: { field: string; order: 'asc' | 'desc' }[],
        priceChangeStatus?: 'decreased' | 'increased' | 'unchanged'
    ): Promise<any> {
        const skip = (page - 1) * pageSize;
        const take = Number(pageSize);
        const allCategories = [
            'trvanlivePotraviny', 'specialnaAZdravaVyziva', 'pecivo', 'ovocieAZeleniny',
            'napoje', 'mrazenePotraviny', 'mliecneVyrobkyAVajcia', 'masoRybyALahodky',
            'grilovanie', 'alkohol', 'starostlivostODomacnost', 'zdravieAKrasa',
        ];
        const availableCategories: Set<string> = new Set(allCategories);

        const fetchProductAnalytics = async (category: string) => {
            const model = this.getPrismaModel(category);

            let whereClause: any = {};
            if (sale !== undefined) {
                whereClause.hasPromotions = sale;
            }

            const latestProducts = await model.findMany({
                where: whereClause,
                include: { promotions: true },
                orderBy: { lastUpdated: 'desc' },
            });

            const productIds = latestProducts.map(product => product.productId);

            let analyticsWhereClause: any = { productId: { in: productIds } };
            if (priceChangeStatus) {
                analyticsWhereClause.priceChangeStatus = priceChangeStatus;
            }

            const analytics = await this.prisma.productAnalytics.findMany({
                where: analyticsWhereClause,
            });

            const productMap = new Map();
            latestProducts.forEach(product => {
                const productAnalytics = analytics.find(a => a.productId === product.productId);
                if (productAnalytics) {  // Only include products that match the priceChangeStatus filter
                    productMap.set(product.productId, {
                        ...this.transformProduct({ ...product, category }),
                        analytics: productAnalytics
                    });
                }
            });

            let products = Array.from(productMap.values());

            // Apply sorting if sortFields are provided
            if (sortFields && sortFields.length > 0) {
                products.sort((a, b) => {
                    for (const { field, order } of sortFields) {
                        const aValue = a.analytics ? a.analytics[field] : 0;
                        const bValue = b.analytics ? b.analytics[field] : 0;
                        if (aValue !== bValue) {
                            if (order === 'desc') {
                                return bValue - aValue;
                            } else {
                                return aValue - bValue;
                            }
                        }
                    }
                    return 0;
                });
            }

            return {
                products,
                totalCount: products.length,
            };
        };

        let totalProducts = 0;
        let products: any[] = [];

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
                { model: 'starostlivostODomacnost', category: 'starostlivostODomacnost' },
                { model: 'zdravieAKrasa', category: 'zdravieAKrasa' }
            ];

            const allProductsPromises = models.map(async ({ model, category }) => {
                const modelInstance = this.prisma[model] as any;
                const result = await fetchProductAnalytics(category);
                totalProducts += result.totalCount;
                return result.products;
            });

            const allProducts = (await Promise.all(allProductsPromises)).flat();
            console.log(`Total products fetched for all categories: ${allProducts.length}`);

            if (randomize) {
                products = allProducts.sort(() => Math.random() - 0.5).slice(skip, skip + take);
            } else {
                products = allProducts.slice(skip, skip + take);
            }

            totalProducts = allProducts.length;
        } else {
            const result = await fetchProductAnalytics(category);
            totalProducts = result.totalCount;
            products = result.products;

            if (randomize) {
                products.sort(() => Math.random() - 0.5);
            }

            products = products.slice(skip, skip + take);
        }

        console.log(`Final number of products: ${products.length}`);
        console.log(`Total products: ${totalProducts}`);

        const totalPages = Math.ceil(totalProducts / pageSize);

        return {
            totalPages,
            totalProducts,
            products,
            availableCategories: Array.from(availableCategories),
        };
    }

    async searchProductsByNameWithAnalytics(
        searchTerm: string,
        page: number,
        pageSize: number,
        sale?: boolean,
        category?: string,
        sortFields?: { field: string; order: 'asc' | 'desc' }[]
    ): Promise<any> {
        const allCategories = [
            'trvanlivePotraviny', 'specialnaAZdravaVyziva', 'pecivo', 'ovocieAZeleniny',
            'napoje', 'mrazenePotraviny', 'mliecneVyrobkyAVajcia', 'masoRybyALahodky',
            'grilovanie', 'alkohol', 'starostlivostODomacnost', 'zdravieAKrasa',
        ];
        const availableCategories: Set<string> = new Set(allCategories);

        let models;

        if (category) {
            models = [{ model: this.getPrismaModel(category), category }];
        } else {
            models = allCategories.map(cat => ({ model: this.getPrismaModel(cat), category: cat }));
        }

        const searchPromises = models.map(({ model, category }) =>
            this.searchModelForTermWithAnalytics(model, searchTerm, sale, category)
        );

        const searchResults = await Promise.all(searchPromises);

        let allProducts = [];
        let totalProducts = 0;

        // Use a Map to keep only the latest version of each product
        const productMap = new Map();

        searchResults.forEach(result => {
            result.products.forEach(product => {
                const existingProduct = productMap.get(product.productId);
                if (!existingProduct || existingProduct.lastUpdated < product.lastUpdated) {
                    productMap.set(product.productId, product);
                }
            });
            totalProducts += result.totalCount;
        });

        allProducts = Array.from(productMap.values());

        // Apply sorting if sortFields are provided
        if (sortFields && sortFields.length > 0) {
            allProducts.sort((a, b) => {
                for (const { field, order } of sortFields) {
                    const aValue = a.analytics ? a.analytics[field] : 0;
                    const bValue = b.analytics ? b.analytics[field] : 0;
                    if (aValue !== bValue) {
                        if (order === 'desc') {
                            return bValue - aValue;
                        } else {
                            return aValue - bValue;
                        }
                    }
                }
                return 0;
            });
        }

        totalProducts = allProducts.length; // Update total count to reflect unique products
        const totalPages = Math.ceil(totalProducts / pageSize);

        // Apply pagination
        const startIndex = (page - 1) * pageSize;
        const paginatedProducts = allProducts.slice(startIndex, startIndex + pageSize);

        return {
            totalPages,
            totalProducts,
            products: paginatedProducts,
            availableCategories: Array.from(availableCategories),
        };
    }

    private async searchModelForTermWithAnalytics(
        model: any,
        searchTerm: string,
        sale?: boolean,
        category?: string
    ) {
        const where: Record<string, any> = {
            title: {
                contains: searchTerm,
                mode: 'insensitive',
            },
        };
        if (sale !== undefined) {
            where['hasPromotions'] = sale;
        }

        const totalCount = await model.count({ where });

        const results = await model.findMany({
            where,
            include: { promotions: true },
            orderBy: { lastUpdated: 'desc' },
        });

        const productIds = results.map((product: any) => product.productId);

        const analyticsData = await this.prisma.productAnalytics.findMany({
            where: { productId: { in: productIds } }
        });

        const productsWithAnalytics = results.map((product: any) => {
            const analytics = analyticsData.find(a => a.productId === product.productId) || this.calculateAnalytics([product]);
            return this.transformProductWithAnalytics({ ...product, category }, analytics);
        });

        return { products: productsWithAnalytics, totalCount };
    }


    async getAnalyticsByProductId(productId: string): Promise<any> {
        const analytics = await this.prisma.productAnalytics.findUnique({
            where: { productId: productId }
        });

        if (!analytics) {
            throw new NotFoundException(`Analytics for product with ID ${productId} not found`);
        }

        return analytics;
    }
}