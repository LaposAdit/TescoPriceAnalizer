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
exports.FavoriteController = void 0;
const common_1 = require("@nestjs/common");
const favorite_service_1 = require("./favorite.service");
const swagger_1 = require("@nestjs/swagger");
const create_favorite_dto_1 = require("../dto/create-favorite.dto");
let FavoriteController = class FavoriteController {
    constructor(favoriteService) {
        this.favoriteService = favoriteService;
    }
    async addFavorite(createFavoriteDto) {
        const { userId, productId, category } = createFavoriteDto;
        return this.favoriteService.addFavorite(userId, productId, category);
    }
    async removeFavorite(userId, productId) {
        return this.favoriteService.removeFavorite(userId, productId);
    }
    async isFavorite(userId, productId) {
        return this.favoriteService.isFavorite(userId, productId);
    }
    async getFavorites(userId) {
        return this.favoriteService.getFavorites(userId);
    }
};
exports.FavoriteController = FavoriteController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add a favorite' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The favorite has been successfully added.' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_favorite_dto_1.CreateFavoriteDto]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "addFavorite", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remove a favorite' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The favorite has been successfully removed.' }),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "removeFavorite", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Check if a product is a favorite' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns true if the product is a favorite, otherwise false.' }),
    (0, common_1.Get)('isFavorite'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "isFavorite", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all favorites for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of favorites for the user.' }),
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FavoriteController.prototype, "getFavorites", null);
exports.FavoriteController = FavoriteController = __decorate([
    (0, swagger_1.ApiTags)('favorites'),
    (0, common_1.Controller)('favorites'),
    __metadata("design:paramtypes", [favorite_service_1.FavoriteService])
], FavoriteController);
//# sourceMappingURL=favorite.controller.js.map