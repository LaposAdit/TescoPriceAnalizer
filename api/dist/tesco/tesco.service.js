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
    createWhereClause(sale) {
        const where = {};
        if (sale !== undefined) {
            where['hasPromotions'] = sale;
        }
        return where;
    }
    async getProducts(category, page, pageSize, sale) {
        const skip = (page - 1) * pageSize;
        const take = Number(pageSize);
        const allCategories = [
            'trvanlivePotraviny', 'specialnaAZdravaVyziva', 'pecivo', 'ovocieAZeleniny',
            'napoje', 'mrazenePotraviny', 'mliecneVyrobkyAVajcia', 'masoRybyALahodky',
            'grilovanie', 'alkohol',
        ];
        const availableCategories = new Set(allCategories);
        const fetchLatestProducts = async (model, where, category) => {
            const latestProducts = await model.findMany({
                where,
                orderBy: [{ productId: 'asc' }, { lastUpdated: 'desc' }],
                distinct: ['productId'],
                include: { promotions: true },
            });
            return latestProducts.map(product => this.transformProduct({ ...product, category }));
        };
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
            let allResults = [];
            for (const { model, category } of models) {
                const where = this.createWhereClause(sale);
                const modelInstance = this.prisma[model];
                const categoryProducts = await fetchLatestProducts(modelInstance, where, category);
                allResults.push(...categoryProducts);
            }
            const totalProducts = allResults.length;
            const totalPages = Math.ceil(totalProducts / pageSize);
            const paginatedProducts = allResults.slice(skip, skip + take);
            return {
                totalPages,
                totalProducts,
                products: paginatedProducts,
                availableCategories: Array.from(availableCategories),
            };
        }
        else {
            const model = this.getPrismaModel(category);
            const where = this.createWhereClause(sale);
            const allProducts = await fetchLatestProducts(model, where, category);
            const totalProducts = allProducts.length;
            const totalPages = Math.ceil(totalProducts / pageSize);
            const paginatedProducts = allProducts.slice(skip, skip + take);
            return {
                totalPages,
                totalProducts,
                products: paginatedProducts,
                availableCategories: Array.from(availableCategories),
            };
        }
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
        const availableCategories = new Set(allCategories);
        let models;
        if (category) {
            models = [{ model: this.getPrismaModel(category), category }];
        }
        else {
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
        const transformedProducts = paginatedProducts.map((product) => ({
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
        }));
        return {
            totalPages,
            totalProducts,
            products: transformedProducts,
            availableCategories: Array.from(availableCategories),
        };
    }
    async getProductsAnalytics(category, page, pageSize, sale, sortBy, sortOrder, minPriceDrop, maxPriceIncrease, minPercentageChange, isBuyRecommended, isOnSale, priceChangeStatus) {
        const skip = (page - 1) * pageSize;
        const take = Number(pageSize);
        const allCategories = [
            'trvanlivePotraviny', 'specialnaAZdravaVyziva', 'pecivo', 'ovocieAZeleniny',
            'napoje', 'mrazenePotraviny', 'mliecneVyrobkyAVajcia', 'masoRybyALahodky',
            'grilovanie', 'alkohol',
        ];
        const availableCategories = new Set(allCategories);
        const fetchProductsWithAnalytics = async (model, where, skip, take, category) => {
            const latestProducts = await model.findMany({
                where,
                include: { promotions: true },
                orderBy: { lastUpdated: 'desc' },
                distinct: ['productId'],
                skip,
                take,
            });
            const productsWithAnalytics = await Promise.all(latestProducts.map(async (product) => {
                const productHistory = await model.findMany({
                    where: { productId: product.productId },
                    include: { promotions: true },
                    orderBy: { lastUpdated: 'desc' },
                    take: 2,
                });
                const analytics = this.calculateAnalytics(productHistory);
                return this.transformProductWithAnalytics({ ...product, category }, analytics);
            }));
            return productsWithAnalytics;
        };
        let allResults = [];
        let totalProducts = 0;
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
            for (const { model, category } of models) {
                const where = this.createWhereClause(sale);
                const modelInstance = this.prisma[model];
                const distinctProducts = await modelInstance.groupBy({
                    by: ['productId'],
                    where,
                    _count: {
                        productId: true
                    }
                });
                const categoryTotal = distinctProducts.length;
                totalProducts += categoryTotal;
                const categoryProducts = await fetchProductsWithAnalytics(modelInstance, where, skip, take, category);
                allResults.push(...categoryProducts);
            }
        }
        else {
            const model = this.getPrismaModel(category);
            const where = this.createWhereClause(sale);
            const distinctProducts = await model.groupBy({
                by: ['productId'],
                where,
                _count: {
                    productId: true
                }
            });
            totalProducts = distinctProducts.length;
            allResults = await fetchProductsWithAnalytics(model, where, skip, take, category);
        }
        let filteredProducts = this.applyAnalyticsFilters(allResults, {
            minPriceDrop,
            maxPriceIncrease,
            minPercentageChange,
            isBuyRecommended,
            isOnSale,
            priceChangeStatus
        });
        if (sortBy && sortOrder) {
            filteredProducts = this.sortProductsByAnalytics(filteredProducts, sortBy, sortOrder);
        }
        const totalPages = Math.ceil(totalProducts / pageSize);
        return {
            totalPages,
            totalProducts,
            products: filteredProducts,
            availableCategories: Array.from(availableCategories),
        };
    }
    calculateAnalytics(products) {
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
        const getCurrentPrice = (product) => {
            if (product.promotions && product.promotions.length > 0 && product.promotions[0].promotionPrice != null) {
                return product.promotions[0].promotionPrice;
            }
            return product.price != null ? product.price : null;
        };
        const currentProduct = products[0];
        const previousProduct = products[1];
        const currentPrice = getCurrentPrice(currentProduct);
        const previousPrice = getCurrentPrice(previousProduct);
        const validPrices = products
            .map(getCurrentPrice)
            .filter((price) => price !== null);
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
        let priceChangeStatus = 'unchanged';
        if (priceDifference > 0) {
            priceChangeStatus = 'decreased';
        }
        else if (priceDifference < 0) {
            priceChangeStatus = 'increased';
        }
        let isBuyRecommended = 'neutral';
        if (priceDifference > 0) {
            isBuyRecommended = 'yes';
        }
        else if (priceDifference < 0) {
            isBuyRecommended = 'no';
        }
        else if (isOnSale) {
            isBuyRecommended = 'yes';
        }
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
    async searchProductsByNameWithAnalytics(searchTerm, page, pageSize, sale, category, sortBy, sortOrder, minPriceDrop, maxPriceIncrease, minPercentageChange, isBuyRecommended, isOnSale, priceChangeStatus) {
        const skip = (page - 1) * pageSize;
        const take = Number(pageSize);
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
        const searchModelForTermWithAnalytics = async (model, searchTerm, skip, take, sale, category) => {
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
                orderBy: { lastUpdated: 'desc' },
                distinct: ['productId'],
                skip,
                take,
            });
            const productsWithAnalytics = await Promise.all(results.map(async (product) => {
                const productHistory = await model.findMany({
                    where: { productId: product.productId },
                    include: { promotions: true },
                    orderBy: { lastUpdated: 'desc' },
                    take: 2,
                });
                const analytics = this.calculateAnalytics(productHistory);
                return this.transformProductWithAnalytics({ ...product, category }, analytics);
            }));
            return productsWithAnalytics;
        };
        let allResults = [];
        let totalProducts = 0;
        for (const { model, category } of models) {
            const modelInstance = this.prisma[model];
            const where = {
                title: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
                ...(sale !== undefined ? { hasPromotions: sale } : {}),
            };
            const categoryTotal = await modelInstance.count({
                where,
                distinct: ['productId']
            });
            totalProducts += categoryTotal;
            const categoryProducts = await searchModelForTermWithAnalytics(modelInstance, searchTerm, skip, take, sale, category);
            allResults.push(...categoryProducts);
        }
        let filteredProducts = this.applyAnalyticsFilters(allResults, {
            minPriceDrop,
            maxPriceIncrease,
            minPercentageChange,
            isBuyRecommended,
            isOnSale,
            priceChangeStatus
        });
        if (sortBy && sortOrder) {
            filteredProducts = this.sortProductsByAnalytics(filteredProducts, sortBy, sortOrder);
        }
        const totalPages = Math.ceil(totalProducts / pageSize);
        return {
            totalPages,
            totalProducts,
            products: filteredProducts,
            availableCategories: Array.from(availableCategories),
        };
    }
    applyAnalyticsFilters(products, filters) {
        return products.filter(product => {
            const analytics = product.analytics;
            if (filters.minPriceDrop !== undefined && analytics.priceDrop < filters.minPriceDrop)
                return false;
            if (filters.maxPriceIncrease !== undefined && analytics.priceIncrease > filters.maxPriceIncrease)
                return false;
            if (filters.minPercentageChange !== undefined && Math.abs(analytics.percentageChange) < filters.minPercentageChange)
                return false;
            if (filters.isBuyRecommended !== undefined && analytics.isBuyRecommended !== filters.isBuyRecommended)
                return false;
            if (filters.isOnSale !== undefined && analytics.isOnSale !== filters.isOnSale)
                return false;
            if (filters.priceChangeStatus !== undefined && analytics.priceChangeStatus !== filters.priceChangeStatus)
                return false;
            return true;
        });
    }
    sortProductsByAnalytics(products, sortBy, sortOrder) {
        return products.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'priceDrop':
                    comparison = a.analytics.priceDrop - b.analytics.priceDrop;
                    break;
                case 'priceIncrease':
                    comparison = a.analytics.priceIncrease - b.analytics.priceIncrease;
                    break;
                case 'percentageChange':
                    comparison = a.analytics.percentageChange - b.analytics.percentageChange;
                    break;
                case 'previousPrice':
                    comparison = a.analytics.previousPrice - b.analytics.previousPrice;
                    break;
                case 'averagePrice':
                    comparison = a.analytics.averagePrice - b.analytics.averagePrice;
                    break;
                default:
                    return 0;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }
};
exports.TescoService = TescoService;
exports.TescoService = TescoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TescoService);
//# sourceMappingURL=tesco.service.js.map