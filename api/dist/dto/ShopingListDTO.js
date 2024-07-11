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
exports.UpdateShoppingListSharingDTO = exports.ShoppingListDeleteResponseDTO = exports.AddToShoppingListResponseDTO = exports.ShoppingListItemResponseDTO = exports.ShoppingListItemDTO = exports.ShoppingListDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const product_category_enum_1 = require("../enum/product-category.enum");
class ShoppingListDTO {
}
exports.ShoppingListDTO = ShoppingListDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Lunch', description: 'The name of the shopping list' }),
    __metadata("design:type", String)
], ShoppingListDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user123', description: 'The ID of the user' }),
    __metadata("design:type", String)
], ShoppingListDTO.prototype, "userId", void 0);
class ShoppingListItemDTO {
}
exports.ShoppingListItemDTO = ShoppingListItemDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'The ID of the shopping list' }),
    __metadata("design:type", Number)
], ShoppingListItemDTO.prototype, "shoppingListId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'product123', description: 'The ID of the product' }),
    __metadata("design:type", String)
], ShoppingListItemDTO.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'The quantity of the product' }),
    __metadata("design:type", Number)
], ShoppingListItemDTO.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_category_enum_1.ProductCategory, example: product_category_enum_1.ProductCategory.SpecialnaAZdravaVyziva, description: 'The category of the product' }),
    __metadata("design:type", String)
], ShoppingListItemDTO.prototype, "category", void 0);
class ShoppingListItemResponseDTO {
}
exports.ShoppingListItemResponseDTO = ShoppingListItemResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'The ID of the shopping list item' }),
    __metadata("design:type", Number)
], ShoppingListItemResponseDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'The ID of the shopping list' }),
    __metadata("design:type", Number)
], ShoppingListItemResponseDTO.prototype, "shoppingListId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Lunch', description: 'The name of the shopping list' }),
    __metadata("design:type", String)
], ShoppingListItemResponseDTO.prototype, "shoppingListName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'product123', description: 'The ID of the product' }),
    __metadata("design:type", String)
], ShoppingListItemResponseDTO.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'The quantity of the product' }),
    __metadata("design:type", Number)
], ShoppingListItemResponseDTO.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_category_enum_1.ProductCategory, example: product_category_enum_1.ProductCategory.SpecialnaAZdravaVyziva, description: 'The category of the product' }),
    __metadata("design:type", String)
], ShoppingListItemResponseDTO.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-07-11T12:00:00Z', description: 'The creation date of the shopping list item' }),
    __metadata("design:type", Date)
], ShoppingListItemResponseDTO.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-07-11T12:00:00Z', description: 'The last update date of the shopping list item' }),
    __metadata("design:type", Date)
], ShoppingListItemResponseDTO.prototype, "updatedAt", void 0);
class AddToShoppingListResponseDTO {
}
exports.AddToShoppingListResponseDTO = AddToShoppingListResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Indicates if the operation was successful' }),
    __metadata("design:type", Boolean)
], AddToShoppingListResponseDTO.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Item successfully added to shopping list', description: 'A message describing the result of the operation' }),
    __metadata("design:type", String)
], AddToShoppingListResponseDTO.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ShoppingListItemResponseDTO, description: 'The details of the added or updated shopping list item', required: false }),
    __metadata("design:type", ShoppingListItemResponseDTO)
], AddToShoppingListResponseDTO.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Error message', description: 'Error message if operation failed', required: false }),
    __metadata("design:type", String)
], AddToShoppingListResponseDTO.prototype, "error", void 0);
class ShoppingListDeleteResponseDTO {
}
exports.ShoppingListDeleteResponseDTO = ShoppingListDeleteResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Indicates if the operation was successful' }),
    __metadata("design:type", Boolean)
], ShoppingListDeleteResponseDTO.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Shopping list successfully deleted', description: 'A message describing the result of the operation' }),
    __metadata("design:type", String)
], ShoppingListDeleteResponseDTO.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { id: 1, itemsDeleted: 5 }, description: 'Additional data about the delete operation', required: false }),
    __metadata("design:type", Object)
], ShoppingListDeleteResponseDTO.prototype, "data", void 0);
class UpdateShoppingListSharingDTO {
}
exports.UpdateShoppingListSharingDTO = UpdateShoppingListSharingDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user123', description: 'The ID of the user' }),
    __metadata("design:type", String)
], UpdateShoppingListSharingDTO.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Indicates if the shopping list should be shared' }),
    __metadata("design:type", Boolean)
], UpdateShoppingListSharingDTO.prototype, "shared", void 0);
//# sourceMappingURL=ShopingListDTO.js.map