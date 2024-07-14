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
exports.ShoppingListController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shopping_list_service_1 = require("./shopping-list.service");
const ShopingListDTO_1 = require("../dto/ShopingListDTO");
let ShoppingListController = class ShoppingListController {
    constructor(shoppingListService) {
        this.shoppingListService = shoppingListService;
    }
    async createShoppingList(dto) {
        return this.shoppingListService.createShoppingList(dto);
    }
    async addItemToShoppingList(dto) {
        return this.shoppingListService.addItemToShoppingList(dto);
    }
    async removeItemFromShoppingList(shoppingListId, productId) {
        return this.shoppingListService.removeItemFromShoppingList(shoppingListId, productId);
    }
    async deleteShoppingList(id) {
        return this.shoppingListService.deleteShoppingList(id);
    }
    async getShoppingListById(id) {
        return this.shoppingListService.getShoppingListById(id);
    }
    async getShoppingListsByUserId(userId) {
        return this.shoppingListService.getShoppingListsByUserId(userId);
    }
    async getShoppingListSummaries(userId) {
        return this.shoppingListService.getShoppingListSummariesByUserId(userId);
    }
    async updateShoppingListSharing(id, dto) {
        return this.shoppingListService.updateShoppingListSharing(id, dto.userId, dto.shared);
    }
    async getShoppingListBySharedUrlId(sharedUrlId) {
        return this.shoppingListService.getShoppingListBySharedUrlId(sharedUrlId);
    }
    async setItemBought(shoppingListId, productId, isBought) {
        return this.shoppingListService.setItemBought(shoppingListId, productId, isBought);
    }
};
exports.ShoppingListController = ShoppingListController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new shopping list' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The shopping list has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input.' }),
    (0, swagger_1.ApiBody)({ type: ShopingListDTO_1.ShoppingListDTO }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ShopingListDTO_1.ShoppingListDTO]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "createShoppingList", null);
__decorate([
    (0, common_1.Post)('item'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Add an item to the shopping list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The item has been successfully added to the shopping list or an error occurred.', type: ShopingListDTO_1.AddToShoppingListResponseDTO }),
    (0, swagger_1.ApiBody)({ type: ShopingListDTO_1.ShoppingListItemDTO }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ShopingListDTO_1.ShoppingListItemDTO]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "addItemToShoppingList", null);
__decorate([
    (0, common_1.Delete)('item/:shoppingListId/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove an item from the shopping list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The item has been successfully removed from the shopping list.' }),
    (0, swagger_1.ApiParam)({ name: 'shoppingListId', type: Number, description: 'The ID of the shopping list' }),
    (0, swagger_1.ApiParam)({ name: 'productId', type: String, description: 'The ID of the product' }),
    __param(0, (0, common_1.Param)('shoppingListId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "removeItemFromShoppingList", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a shopping list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The shopping list has been successfully deleted or not found.', type: ShopingListDTO_1.ShoppingListDeleteResponseDTO }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'The ID of the shopping list' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "deleteShoppingList", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a shopping list by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The shopping list has been successfully retrieved.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Shopping list not found.' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'The ID of the shopping list' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "getShoppingListById", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all shopping lists for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The shopping lists have been successfully retrieved.' }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: String, description: 'The ID of the user' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "getShoppingListsByUserId", null);
__decorate([
    (0, common_1.Get)('summaries/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get shopping list summaries for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns the shopping list summaries for the user.' }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: String, description: 'The ID of the user' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "getShoppingListSummaries", null);
__decorate([
    (0, common_1.Patch)(':id/share'),
    (0, swagger_1.ApiOperation)({ summary: 'Update the sharing status of a shopping list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The sharing status has been successfully updated.' }),
    (0, swagger_1.ApiBody)({ type: ShopingListDTO_1.UpdateShoppingListSharingDTO }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'The ID of the shopping list' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, ShopingListDTO_1.UpdateShoppingListSharingDTO]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "updateShoppingListSharing", null);
__decorate([
    (0, common_1.Get)('shared/:sharedUrlId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a shopping list by shared URL ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The shopping list has been successfully retrieved.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Shopping list not found.' }),
    (0, swagger_1.ApiParam)({ name: 'sharedUrlId', type: String, description: 'The shared URL ID of the shopping list' }),
    __param(0, (0, common_1.Param)('sharedUrlId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "getShoppingListBySharedUrlId", null);
__decorate([
    (0, common_1.Patch)('item/:shoppingListId/:productId/bought'),
    (0, swagger_1.ApiOperation)({ summary: 'Set an item as bought or not bought' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The item has been successfully updated.' }),
    (0, swagger_1.ApiParam)({ name: 'shoppingListId', type: Number, description: 'The ID of the shopping list' }),
    (0, swagger_1.ApiParam)({ name: 'productId', type: String, description: 'The ID of the product' }),
    (0, swagger_1.ApiBody)({ schema: { properties: { isBought: { type: 'boolean' } } } }),
    __param(0, (0, common_1.Param)('shoppingListId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)('isBought')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Boolean]),
    __metadata("design:returntype", Promise)
], ShoppingListController.prototype, "setItemBought", null);
exports.ShoppingListController = ShoppingListController = __decorate([
    (0, swagger_1.ApiTags)('Shopping List'),
    (0, common_1.Controller)('shopping-list'),
    __metadata("design:paramtypes", [shopping_list_service_1.ShoppingListService])
], ShoppingListController);
//# sourceMappingURL=shopping-list.controller.js.map