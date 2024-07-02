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
exports.TescoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let TescoService = class TescoService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    transformProduct(product) {
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
            promotions: product.promotions.map((promo) => ({
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
    transformProductWithAnalytics(product, analytics) {
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
            promotions: product.promotions.map((promo) => ({
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
    getPrismaModel(category) {
        const modelMapping = {
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
            throw new common_1.NotFoundException(`Model for category ${category} not found`);
        }
        return model;
    }
    async getProducts(category, page, pageSize, sale, randomize) {
        console.log(`Fetching products for category: ${category}, page: ${page}, pageSize: ${pageSize}, sale: ${sale}, randomize: ${randomize}`);
        const skip = (page - 1) * pageSize;
        const take = Number(pageSize);
        const allCategories = [
            'trvanlivePotraviny', 'specialnaAZdravaVyziva', 'pecivo', 'ovocieAZeleniny',
            'napoje', 'mrazenePotraviny', 'mliecneVyrobkyAVajcia', 'masoRybyALahodky',
            'grilovanie', 'alkohol',
        ];
        const availableCategories = new Set(allCategories);
        const fetchLatestProducts = async (model, category, sale) => {
            let whereClause = {};
            if (sale === true) {
                whereClause = { hasPromotions: true };
            }
            else if (sale === false) {
                whereClause = { hasPromotions: false };
            }
            const latestDate = await model.findFirst({
                where: whereClause,
                orderBy: { lastUpdated: 'desc' },
                select: { lastUpdated: true },
            });
            if (!latestDate) {
                console.log(`No products found for category: ${category} with sale filter: ${sale}`);
                return { products: [], totalCount: 0 };
            }
            const products = await model.findMany({
                where: {
                    ...whereClause,
                    lastUpdated: {
                        gte: new Date(latestDate.lastUpdated.toDateString()),
                        lt: new Date(new Date(latestDate.lastUpdated).setDate(latestDate.lastUpdated.getDate() + 1))
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
        let products = [];
        if (category === 'all') {
            const models = [
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
            const allProductsPromises = models.map(async ({ model, category }) => {
                const modelInstance = this.prisma[model];
                const result = await fetchLatestProducts(modelInstance, category, sale);
                totalProducts += result.totalCount;
                return result.products;
            });
            const allProducts = (await Promise.all(allProductsPromises)).flat();
            console.log(`Total products fetched for all categories: ${allProducts.length}`);
            if (randomize) {
                products = allProducts.sort(() => Math.random() - 0.5).slice(skip, skip + take);
            }
            else {
                products = allProducts.sort((a, b) => a.productId.localeCompare(b.productId)).slice(skip, skip + take);
            }
            totalProducts = allProducts.length;
        }
        else {
            const model = this.getPrismaModel(category);
            const result = await fetchLatestProducts(model, category, sale);
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
    createWhereClause(sale) {
        const where = {};
        if (sale !== undefined) {
            where['promotions'] = sale ? { some: {} } : { none: {} };
        }
        return where;
    }
    async getProductById(category, productId) {
        const model = this.getPrismaModel(category);
        const productsFromDb = await model.findMany({
            where: { productId },
            include: { promotions: true },
            orderBy: { lastUpdated: 'desc' }
        });
        return productsFromDb.map(product => ({
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
            category,
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
        }));
    }
    async searchModelForTerm(model, searchTerm, sale, category) {
        const where = {
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
        return results.map((product) => ({
            ...product,
            category
        }));
    }
    async searchProductsByName(searchTerm, page, pageSize, sale, category) {
        const allCategories = [
            'trvanlivePotraviny', 'specialnaAZdravaVyziva', 'pecivo', 'ovocieAZeleniny',
            'napoje', 'mrazenePotraviny', 'mliecneVyrobkyAVajcia', 'masoRybyALahodky',
            'grilovanie', 'alkohol',
        ];
        const availableCategories = new Set(allCategories);
        let models;
        if (category) {
            models = [{ model: this.getPrismaModel(category), category }];
        }
        else {
            models = allCategories.map(cat => ({ model: this.getPrismaModel(cat), category: cat }));
        }
        const searchLatestProducts = async (model, searchTerm, sale, category) => {
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
            const latestProducts = await Promise.all(latestProductsQuery.map(async (item) => {
                const product = await model.findFirst({
                    where: {
                        productId: item.productId,
                        lastUpdated: item._max.lastUpdated,
                    },
                    include: { promotions: true },
                });
                return product;
            }));
            let filteredProducts = latestProducts;
            if (sale !== undefined) {
                filteredProducts = latestProducts.filter(product => (sale && product.promotions.length > 0) || (!sale && product.promotions.length === 0));
            }
            return filteredProducts.map(product => this.transformProduct({ ...product, category }));
        };
        const searchPromises = models.map(({ model, category }) => searchLatestProducts(model, searchTerm, sale, category));
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
    async calculateAndStoreAnalytics(category) {
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
                console.log(`Product data: ${JSON.stringify(product)}`);
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
                }
                catch (error) {
                    console.error(`Error processing product ${i + index + 1} of ${latestProducts.length} - Product ID: ${product.productId}`, error);
                }
            });
            await Promise.all(batchPromises);
        }
    }
    calculateAnalytics(products) {
        const currentProduct = products[0];
        const isOnSale = currentProduct.hasPromotions;
        if (products.length < 2) {
            return {
                priceDrop: 0,
                priceIncrease: 0,
                percentageChange: 0,
                isBuyRecommended: isOnSale ? 'yes' : 'neutral',
                isOnSale: isOnSale,
                previousPrice: null,
                priceChangeStatus: 'unknown',
                averagePrice: null,
                medianPrice: null,
                priceStdDev: null,
                promotionImpact: null
            };
        }
        const getCurrentPrice = (product) => {
            if (product.promotions && product.promotions.length > 0 && product.promotions[0].promotionPrice != null) {
                return product.promotions[0].promotionPrice;
            }
            return product.price;
        };
        const currentPrice = getCurrentPrice(currentProduct);
        const previousPrice = getCurrentPrice(products[1]);
        const priceDifference = previousPrice - currentPrice;
        const percentageChange = (priceDifference / previousPrice) * 100;
        const validPrices = products.slice(0, 5).map(getCurrentPrice);
        const averagePrice = validPrices.length > 0
            ? parseFloat((validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length).toFixed(2))
            : null;
        const medianPrice = validPrices.length > 0
            ? parseFloat(validPrices.sort((a, b) => a - b)[Math.floor(validPrices.length / 2)].toFixed(2))
            : null;
        const priceStdDev = validPrices.length > 0
            ? parseFloat(Math.sqrt(validPrices.map(price => Math.pow(price - averagePrice, 2)).reduce((sum, sq) => sum + sq, 0) / validPrices.length).toFixed(2))
            : null;
        let priceChangeStatus = 'unchanged';
        if (currentPrice < previousPrice) {
            priceChangeStatus = 'decreased';
        }
        else if (currentPrice > previousPrice) {
            priceChangeStatus = 'increased';
        }
        let isBuyRecommended = 'neutral';
        if (currentPrice < previousPrice || (averagePrice !== null && currentPrice < averagePrice)) {
            isBuyRecommended = 'yes';
        }
        else if (currentPrice > previousPrice) {
            isBuyRecommended = 'no';
        }
        else if (isOnSale) {
            isBuyRecommended = 'yes';
        }
        const promotionImpact = isOnSale && previousPrice !== null
            ? parseFloat((previousPrice - currentPrice).toFixed(2))
            : null;
        return {
            priceDrop: currentPrice < previousPrice ? parseFloat(priceDifference.toFixed(2)) : 0,
            priceIncrease: currentPrice > previousPrice ? parseFloat(Math.abs(priceDifference).toFixed(2)) : 0,
            percentageChange: parseFloat(percentageChange.toFixed(2)),
            isBuyRecommended,
            isOnSale,
            previousPrice: parseFloat(previousPrice.toFixed(2)),
            priceChangeStatus,
            averagePrice,
            medianPrice,
            priceStdDev,
            promotionImpact
        };
    }
    async getProductsAnalytics(category, page, pageSize, sale, randomize) {
        const skip = (page - 1) * pageSize;
        const take = Number(pageSize);
        const allCategories = [
            'trvanlivePotraviny', 'specialnaAZdravaVyziva', 'pecivo', 'ovocieAZeleniny',
            'napoje', 'mrazenePotraviny', 'mliecneVyrobkyAVajcia', 'masoRybyALahodky',
            'grilovanie', 'alkohol',
        ];
        const availableCategories = new Set(allCategories);
        const fetchLatestProducts = async (model, category, sale) => {
            let whereClause = {};
            if (sale === true) {
                whereClause = { hasPromotions: true };
            }
            else if (sale === false) {
                whereClause = { hasPromotions: false };
            }
            const latestDate = await model.findFirst({
                where: whereClause,
                orderBy: { lastUpdated: 'desc' },
                select: { lastUpdated: true },
            });
            if (!latestDate) {
                console.log(`No products found for category: ${category} with sale filter: ${sale}`);
                return { products: [], totalCount: 0 };
            }
            const products = await model.findMany({
                where: {
                    ...whereClause,
                    lastUpdated: {
                        gte: new Date(latestDate.lastUpdated.toDateString()),
                        lt: new Date(new Date(latestDate.lastUpdated).setDate(latestDate.lastUpdated.getDate() + 1))
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
        const fetchProductAnalytics = async (category) => {
            const model = this.getPrismaModel(category);
            let whereClause = {};
            if (sale !== undefined) {
                whereClause = { hasPromotions: sale };
            }
            const latestProducts = await model.findMany({
                where: whereClause,
                include: { promotions: true },
                orderBy: { lastUpdated: 'desc' },
            });
            const productIds = latestProducts.map(product => product.productId);
            const analytics = await this.prisma.productAnalytics.findMany({
                where: {
                    productId: { in: productIds }
                },
            });
            const productMap = new Map();
            latestProducts.forEach(product => {
                productMap.set(product.productId, {
                    ...this.transformProduct({ ...product, category }),
                    analytics: analytics.find(a => a.productId === product.productId)
                });
            });
            const products = Array.from(productMap.values());
            return {
                products,
                totalCount: products.length,
            };
        };
        let totalProducts = 0;
        let products = [];
        if (category === 'all') {
            const models = [
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
            const allProductsPromises = models.map(async ({ model, category }) => {
                const modelInstance = this.prisma[model];
                const result = await fetchProductAnalytics(category);
                totalProducts += result.totalCount;
                return result.products;
            });
            const allProducts = (await Promise.all(allProductsPromises)).flat();
            console.log(`Total products fetched for all categories: ${allProducts.length}`);
            if (randomize) {
                products = allProducts.sort(() => Math.random() - 0.5).slice(skip, skip + take);
            }
            else {
                products = allProducts.sort((a, b) => a.productId.localeCompare(b.productId)).slice(skip, skip + take);
            }
            totalProducts = allProducts.length;
        }
        else {
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
    async searchProductsByNameWithAnalytics(searchTerm, page, pageSize, sale, category) {
        const allCategories = [
            'trvanlivePotraviny', 'specialnaAZdravaVyziva', 'pecivo', 'ovocieAZeleniny',
            'napoje', 'mrazenePotraviny', 'mliecneVyrobkyAVajcia', 'masoRybyALahodky',
            'grilovanie', 'alkohol',
        ];
        const availableCategories = new Set(allCategories);
        let models;
        if (category) {
            models = [{ model: this.getPrismaModel(category), category }];
        }
        else {
            models = allCategories.map(cat => ({ model: this.getPrismaModel(cat), category: cat }));
        }
        const searchPromises = models.map(({ model, category }) => this.searchModelForTermWithAnalytics(model, searchTerm, sale, category));
        const searchResults = await Promise.all(searchPromises);
        const productsFromDb = searchResults.flat();
        const latestProductsMap = new Map();
        productsFromDb.forEach(product => {
            if (!latestProductsMap.has(product.productId) || latestProductsMap.get(product.productId).lastUpdated < product.lastUpdated) {
                latestProductsMap.set(product.productId, product);
            }
        });
        const latestProducts = Array.from(latestProductsMap.values());
        const totalProducts = latestProducts.length;
        const totalPages = Math.ceil(totalProducts / pageSize);
        const skip = (page - 1) * pageSize;
        const paginatedProducts = latestProducts.slice(skip, skip + pageSize);
        return {
            totalPages,
            totalProducts,
            products: paginatedProducts,
            availableCategories: Array.from(availableCategories),
        };
    }
    async searchModelForTermWithAnalytics(model, searchTerm, sale, category) {
        const where = {
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
        const productsWithAnalytics = await Promise.all(results.map(async (product) => {
            const productHistory = await model.findMany({
                where: { productId: product.productId },
                include: { promotions: true },
                orderBy: { lastUpdated: 'desc' },
            });
            const analytics = this.calculateAnalytics(productHistory);
            return this.transformProductWithAnalytics({ ...product, category }, analytics);
        }));
        return productsWithAnalytics;
    }
};
exports.TescoService = TescoService;
exports.TescoService = TescoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TescoService);
//# sourceMappingURL=tesco.service.js.map