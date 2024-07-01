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
    async getProductsAnalyticsFromDb(category = 'all', page = 1, pageSize = 25, sale, sortBy, sortOrder, minPriceDrop, maxPriceIncrease, minPercentageChange, isBuyRecommended, isOnSale, priceChangeStatus) {
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;
        return this.service.getProductsAnalytics(category, page, pageSize, saleBoolean, sortBy, sortOrder, minPriceDrop, maxPriceIncrease, minPercentageChange, isBuyRecommended, isOnSale, priceChangeStatus);
    }
    async getProductsFromDb(category = 'all', page = 1, pageSize = 25, sale) {
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;
        return this.service.getProducts(category, page, pageSize, saleBoolean);
    }
    async searchProductsByNameWithAnalytics(searchTerm, page = 1, pageSize = 25, sale, category, sortBy, sortOrder, minPriceDrop, maxPriceIncrease, minPercentageChange, isBuyRecommended, isOnSale, priceChangeStatus) {
        console.log("Analytics search request received with term:", searchTerm);
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;
        return this.service.searchProductsByNameWithAnalytics(searchTerm, page, pageSize, saleBoolean, category, sortBy, sortOrder, minPriceDrop, maxPriceIncrease, minPercentageChange, isBuyRecommended, isOnSale, priceChangeStatus);
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
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, enum: Object.values(product_category_enum_1.ProductCategory), description: 'Product category' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, description: 'Number of items per page', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sale', required: false, description: 'Filter by sale', type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, enum: ['priceDrop', 'priceIncrease', 'percentageChange', 'previousPrice', 'averagePrice'], description: 'Sort by analytics field' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' }),
    (0, swagger_1.ApiQuery)({ name: 'minPriceDrop', required: false, type: Number, description: 'Minimum price drop' }),
    (0, swagger_1.ApiQuery)({ name: 'maxPriceIncrease', required: false, type: Number, description: 'Maximum price increase' }),
    (0, swagger_1.ApiQuery)({ name: 'minPercentageChange', required: false, type: Number, description: 'Minimum percentage change' }),
    (0, swagger_1.ApiQuery)({ name: 'isBuyRecommended', required: false, enum: ['yes', 'no', 'neutral'], description: 'Buy recommendation' }),
    (0, swagger_1.ApiQuery)({ name: 'isOnSale', required: false, type: Boolean, description: 'Is on sale' }),
    (0, swagger_1.ApiQuery)({ name: 'priceChangeStatus', required: false, enum: ['decreased', 'increased', 'unchanged'], description: 'Price change status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The products with analytics have been successfully fetched from the database.', type: Object }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('sale')),
    __param(4, (0, common_1.Query)('sortBy')),
    __param(5, (0, common_1.Query)('sortOrder')),
    __param(6, (0, common_1.Query)('minPriceDrop')),
    __param(7, (0, common_1.Query)('maxPriceIncrease')),
    __param(8, (0, common_1.Query)('minPercentageChange')),
    __param(9, (0, common_1.Query)('isBuyRecommended')),
    __param(10, (0, common_1.Query)('isOnSale')),
    __param(11, (0, common_1.Query)('priceChangeStatus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String, String, String, Number, Number, Number, String, Boolean, String]),
    __metadata("design:returntype", Promise)
], TescoController.prototype, "getProductsAnalyticsFromDb", null);
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
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The products have been successfully fetched from the database.', type: Object }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('sale')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String]),
    __metadata("design:returntype", Promise)
], TescoController.prototype, "getProductsFromDb", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Search products by name with analytics' }),
    (0, swagger_1.ApiQuery)({ name: 'searchTerm', required: true, description: 'Search term for product title' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number', type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, description: 'Number of items per page', type: Number, example: 25 }),
    (0, swagger_1.ApiQuery)({ name: 'sale', required: false, description: 'Filter by sale', type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, enum: product_category_enum_1.ProductCategory, description: 'Product category' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, enum: ['priceDrop', 'priceIncrease', 'percentageChange', 'previousPrice', 'averagePrice'], description: 'Sort by analytics field' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' }),
    (0, swagger_1.ApiQuery)({ name: 'minPriceDrop', required: false, type: Number, description: 'Minimum price drop' }),
    (0, swagger_1.ApiQuery)({ name: 'maxPriceIncrease', required: false, type: Number, description: 'Maximum price increase' }),
    (0, swagger_1.ApiQuery)({ name: 'minPercentageChange', required: false, type: Number, description: 'Minimum percentage change' }),
    (0, swagger_1.ApiQuery)({ name: 'isBuyRecommended', required: false, enum: ['yes', 'no', 'neutral'], description: 'Buy recommendation' }),
    (0, swagger_1.ApiQuery)({ name: 'isOnSale', required: false, type: Boolean, description: 'Is on sale' }),
    (0, swagger_1.ApiQuery)({ name: 'priceChangeStatus', required: false, enum: ['decreased', 'increased', 'unchanged'], description: 'Price change status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of products matching the search term with analytics' }),
    (0, common_1.Get)('search/analytics'),
    __param(0, (0, common_1.Query)('searchTerm')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('sale')),
    __param(4, (0, common_1.Query)('category')),
    __param(5, (0, common_1.Query)('sortBy')),
    __param(6, (0, common_1.Query)('sortOrder')),
    __param(7, (0, common_1.Query)('minPriceDrop')),
    __param(8, (0, common_1.Query)('maxPriceIncrease')),
    __param(9, (0, common_1.Query)('minPercentageChange')),
    __param(10, (0, common_1.Query)('isBuyRecommended')),
    __param(11, (0, common_1.Query)('isOnSale')),
    __param(12, (0, common_1.Query)('priceChangeStatus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String, String, String, String, Number, Number, Number, String, Boolean, String]),
    __metadata("design:returntype", Promise)
], TescoController.prototype, "searchProductsByNameWithAnalytics", null);
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