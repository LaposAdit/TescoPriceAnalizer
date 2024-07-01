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
exports.AlkoholController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const alkohol_service_1 = require("./alkohol.service");
const AlkoholDTO_1 = require("../dto/AlkoholDTO");
let AlkoholController = class AlkoholController {
    constructor(alkoholService) {
        this.alkoholService = alkoholService;
    }
    async getProductsFromDb(page = 1, pageSize = 25, sale) {
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;
        return this.alkoholService.getProducts(false, Number(page), Number(pageSize), saleBoolean);
    }
    async updateAndGetProducts() {
        await this.alkoholService.updateProductsFromApi();
        return { message: 'The products have been successfully updated from the API.' };
    }
    async getProductById(productId) {
        return this.alkoholService.getProductById(productId);
    }
};
exports.AlkoholController = AlkoholController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, description: 'Number of items per page', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sale', required: false, description: 'Filter by sale', type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The products have been successfully fetched from the database.', type: AlkoholDTO_1.AlkoholResponseDto }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('sale')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AlkoholController.prototype, "getProductsFromDb", null);
__decorate([
    (0, common_1.Get)('update'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The products have been successfully updated from the API.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlkoholController.prototype, "updateAndGetProducts", null);
__decorate([
    (0, common_1.Get)(':productId'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The product history has been successfully fetched from the database.', type: [AlkoholDTO_1.AlkoholTransformedProductDto] }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlkoholController.prototype, "getProductById", null);
exports.AlkoholController = AlkoholController = __decorate([
    (0, swagger_1.ApiTags)('Alkohol'),
    (0, common_1.Controller)('alkohol'),
    __metadata("design:paramtypes", [alkohol_service_1.AlkoholService])
], AlkoholController);
//# sourceMappingURL=alkohol.controller.js.map