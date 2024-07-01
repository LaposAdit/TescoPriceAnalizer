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
exports.OvocieAZeleninyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ovocie_a_zeleniny_response_dto_1 = require("../dto/ovocie-a-zeleniny-response.dto");
const ovocie_a_zeleniny_service_1 = require("./ovocie-a-zeleniny.service");
const ovocie_a_zeleniny_response_dto_2 = require("../dto/ovocie-a-zeleniny-response.dto");
let OvocieAZeleninyController = class OvocieAZeleninyController {
    constructor(ovocieAZeleninyService) {
        this.ovocieAZeleninyService = ovocieAZeleninyService;
    }
    async getProductsFromDb(page = 1, pageSize = 25, sale) {
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;
        return this.ovocieAZeleninyService.getProducts(false, Number(page), Number(pageSize), saleBoolean);
    }
    async updateAndGetProducts() {
        await this.ovocieAZeleninyService.updateProductsFromApi();
        return { message: 'The products have been successfully updated from the API.' };
    }
    async getProductById(productId) {
        return this.ovocieAZeleninyService.getProductById(productId);
    }
};
exports.OvocieAZeleninyController = OvocieAZeleninyController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, description: 'Number of items per page', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sale', required: false, description: 'Filter by sale', type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The products have been successfully fetched from the database.', type: ovocie_a_zeleniny_response_dto_1.OvocieAZeleninyResponseDto }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('sale')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], OvocieAZeleninyController.prototype, "getProductsFromDb", null);
__decorate([
    (0, common_1.Get)('update'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The products have been successfully updated from the API.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OvocieAZeleninyController.prototype, "updateAndGetProducts", null);
__decorate([
    (0, common_1.Get)(':productId'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The product history has been successfully fetched from the database.', type: [ovocie_a_zeleniny_response_dto_2.OvocieAZeleninyTransformedProductDto] }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OvocieAZeleninyController.prototype, "getProductById", null);
exports.OvocieAZeleninyController = OvocieAZeleninyController = __decorate([
    (0, swagger_1.ApiTags)('Ovocie a Zeleniny'),
    (0, common_1.Controller)('ovocie-a-zeleniny'),
    __metadata("design:paramtypes", [ovocie_a_zeleniny_service_1.OvocieAZeleninyService])
], OvocieAZeleninyController);
//# sourceMappingURL=ovocie-a-zeleniny.controller.js.map