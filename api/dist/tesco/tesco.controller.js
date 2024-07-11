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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TescoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const product_category_enum_1 = require("../enum/product-category.enum");
const tesco_service_1 = require("./tesco.service");
let TescoController = class TescoController {
    constructor(service) {
        this.service = service;
    }
    async getProductsAnalyticsFromDb(category = 'all', page = 1, pageSize = 25, sale, sortLastCalculated, sortPriceChangeStatus, sortIsBuyRecommended, sortPercentageChange, sortUpdatedAt, sortAveragePrice, priceChangeStatus) {
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;
        const sortFields = [
            { field: 'lastCalculated', order: sortLastCalculated },
            { field: 'priceChangeStatus', order: sortPriceChangeStatus },
            { field: 'isBuyRecommended', order: sortIsBuyRecommended },
            { field: 'percentageChange', order: sortPercentageChange },
            { field: 'updatedAt', order: sortUpdatedAt },
            { field: 'averagePrice', order: sortAveragePrice },
        ]
            .filter(item => item.order !== undefined)
            .map(item => ({ field: item.field, order: item.order }));
        return this.service.getProductsAnalytics(category, page, pageSize, saleBoolean, false, sortFields, priceChangeStatus);
    }
    async searchProductsByNameWithAnalytics(searchTerm, page = 1, pageSize = 25, sale, category, sortLastCalculated, sortPriceChangeStatus, sortIsBuyRecommended, sortPercentageChange, sortUpdatedAt, sortAveragePrice) {
        console.log("Analytics search request received with term:", searchTerm);
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;
        const sortFields = [
            { field: 'lastCalculated', order: sortLastCalculated },
            { field: 'priceChangeStatus', order: sortPriceChangeStatus },
            { field: 'isBuyRecommended', order: sortIsBuyRecommended },
            { field: 'percentageChange', order: sortPercentageChange },
            { field: 'updatedAt', order: sortUpdatedAt },
            { field: 'averagePrice', order: sortAveragePrice },
        ]
            .filter(item => item.order !== undefined)
            .map(item => ({ field: item.field, order: item.order }));
        return this.service.searchProductsByNameWithAnalytics(searchTerm, Number(page), Number(pageSize), saleBoolean, category, sortFields);
    }
    async getAnalyticsByProductId(productId) {
        return this.service.getAnalyticsByProductId(productId);
    }
    async calculateAnalytics(category) {
        if (category === 'all') {
            const categories = ['trvanlivePotraviny', 'specialnaAZdravaVyziva', 'pecivo', 'ovocieAZeleniny', 'napoje', 'mrazenePotraviny', 'mliecneVyrobkyAVajcia', 'masoRybyALahodky', 'grilovanie', 'alkohol', 'starostlivostODomacnost', 'zdravieAKrasa'];
            for (const cat of categories) {
                await this.service.calculateAndStoreAnalytics(cat);
            }
        }
        else {
            await this.service.calculateAndStoreAnalytics(category);
        }
        return { message: 'Analytics calculated and stored successfully' };
    }
    async getProductsFromDb(category = 'all', page = 1, pageSize = 25, sale, randomize) {
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;
        const randomizeBoolean = randomize === 'true';
        return this.service.getProducts(category, page, pageSize, saleBoolean, randomizeBoolean);
    }
    async searchProductsByName(searchTerm, page = 1, pageSize = 25, sale, category) {
        console.log("Search request received with term:", searchTerm);
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;
        return this.service.searchProductsByName(searchTerm, page, pageSize, saleBoolean, category);
    }
    async getProductById(category, productId) {
        return this.service.getProductById(category, productId);
    }
};
exports.TescoController = TescoController;
__decorate([
    (0, common_1.Get)('analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get products with analytics' }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        enum: Object.values(product_category_enum_1.ProductCategory),
        description: 'Product category'
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, description: 'Number of items per page', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sale', required: false, description: 'Filter by sale', type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'sortLastCalculated', required: false, enum: ['asc', 'desc'], description: 'Sort by lastCalculated' }),
    (0, swagger_1.ApiQuery)({ name: 'sortPriceChangeStatus', required: false, enum: ['asc', 'desc'], description: 'Sort by priceChangeStatus' }),
    (0, swagger_1.ApiQuery)({ name: 'sortIsBuyRecommended', required: false, enum: ['asc', 'desc'], description: 'Sort by isBuyRecommended' }),
    (0, swagger_1.ApiQuery)({ name: 'sortPercentageChange', required: false, enum: ['asc', 'desc'], description: 'Sort by percentageChange' }),
    (0, swagger_1.ApiQuery)({ name: 'sortUpdatedAt', required: false, enum: ['asc', 'desc'], description: 'Sort by updatedAt' }),
    (0, swagger_1.ApiQuery)({ name: 'sortAveragePrice', required: false, enum: ['asc', 'desc'], description: 'Sort by averagePrice' }),
    (0, swagger_1.ApiQuery)({
        name: 'priceChangeStatus',
        required: false,
        enum: ['decreased', 'increased', 'unchanged'],
        description: 'Filter by price change status'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The products with analytics have been successfully fetched from the database.', type: Object }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('sale')),
    __param(4, (0, common_1.Query)('sortLastCalculated')),
    __param(5, (0, common_1.Query)('sortPriceChangeStatus')),
    __param(6, (0, common_1.Query)('sortIsBuyRecommended')),
    __param(7, (0, common_1.Query)('sortPercentageChange')),
    __param(8, (0, common_1.Query)('sortUpdatedAt')),
    __param(9, (0, common_1.Query)('sortAveragePrice')),
    __param(10, (0, common_1.Query)('priceChangeStatus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TescoController.prototype, "getProductsAnalyticsFromDb", null);
__decorate([
    (0, common_1.Get)('search/analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Search products by name with analytics' }),
    (0, swagger_1.ApiQuery)({ name: 'searchTerm', required: true, description: 'Search term for product title' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number', type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, description: 'Number of items per page', type: Number, example: 25 }),
    (0, swagger_1.ApiQuery)({ name: 'sale', required: false, description: 'Filter by sale', type: Boolean }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        enum: Object.values(product_category_enum_1.ProductCategory),
        description: 'Product category'
    }),
    (0, swagger_1.ApiQuery)({ name: 'sortLastCalculated', required: false, enum: ['asc', 'desc'], description: 'Sort by lastCalculated' }),
    (0, swagger_1.ApiQuery)({ name: 'sortPriceChangeStatus', required: false, enum: ['asc', 'desc'], description: 'Sort by priceChangeStatus' }),
    (0, swagger_1.ApiQuery)({ name: 'sortIsBuyRecommended', required: false, enum: ['asc', 'desc'], description: 'Sort by isBuyRecommended' }),
    (0, swagger_1.ApiQuery)({ name: 'sortPercentageChange', required: false, enum: ['asc', 'desc'], description: 'Sort by percentageChange' }),
    (0, swagger_1.ApiQuery)({ name: 'sortUpdatedAt', required: false, enum: ['asc', 'desc'], description: 'Sort by updatedAt' }),
    (0, swagger_1.ApiQuery)({ name: 'sortAveragePrice', required: false, enum: ['asc', 'desc'], description: 'Sort by averagePrice' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of products matching the search term with analytics' }),
    __param(0, (0, common_1.Query)('searchTerm')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('sale')),
    __param(4, (0, common_1.Query)('category')),
    __param(5, (0, common_1.Query)('sortLastCalculated')),
    __param(6, (0, common_1.Query)('sortPriceChangeStatus')),
    __param(7, (0, common_1.Query)('sortIsBuyRecommended')),
    __param(8, (0, common_1.Query)('sortPercentageChange')),
    __param(9, (0, common_1.Query)('sortUpdatedAt')),
    __param(10, (0, common_1.Query)('sortAveragePrice')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TescoController.prototype, "searchProductsByNameWithAnalytics", null);
__decorate([
    (0, common_1.Get)('analytics/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get analytics data for a specific product' }),
    (0, swagger_1.ApiParam)({ name: 'productId', required: true, description: 'ID of the product' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics data for the specified product' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product analytics not found' }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TescoController.prototype, "getAnalyticsByProductId", null);
__decorate([
    (0, common_1.Post)('calculate-analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate and store analytics for products' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: true, enum: ['all', 'trvanlivePotraviny', 'specialnaAZdravaVyziva', 'pecivo', 'ovocieAZeleniny', 'napoje', 'mrazenePotraviny', 'mliecneVyrobkyAVajcia', 'masoRybyALahodky', 'grilovanie', 'alkohol', 'starostlivostODomacnost', 'zdravieAKrasa'] }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics calculated and stored successfully' }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TescoController.prototype, "calculateAnalytics", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        enum: Object.values(product_category_enum_1.ProductCategory),
        description: 'Product category'
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, description: 'Number of items per page', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sale', required: false, description: 'Filter by sale', type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'randomize', required: false, description: 'Randomize the order of products', type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The products have been successfully fetched from the database.', type: Object }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('sale')),
    __param(4, (0, common_1.Query)('randomize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], TescoController.prototype, "getProductsFromDb", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Search products by name' }),
    (0, swagger_1.ApiQuery)({ name: 'searchTerm', required: true, description: 'Search term for product title' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number', type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, description: 'Number of items per page', type: Number, example: 25 }),
    (0, swagger_1.ApiQuery)({ name: 'sale', required: false, description: 'Filter by sale', type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, enum: product_category_enum_1.ProductCategory, description: 'Product category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of products matching the search term' }),
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('searchTerm')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('sale')),
    __param(4, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], TescoController.prototype, "searchProductsByName", null);
__decorate([
    (0, common_1.Get)(':category/:productId'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The product history has been successfully fetched from the database.', type: Object }),
    __param(0, (0, common_1.Param)('category')),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TescoController.prototype, "getProductById", null);
exports.TescoController = TescoController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [tesco_service_1.TescoService])
], TescoController);
//# sourceMappingURL=tesco.controller.js.map