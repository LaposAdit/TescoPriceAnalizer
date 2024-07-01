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
exports.CreateFavoriteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const product_category_enum_1 = require("../enum/product-category.enum");
class CreateFavoriteDto {
}
exports.CreateFavoriteDto = CreateFavoriteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user123', description: 'The ID of the user' }),
    __metadata("design:type", String)
], CreateFavoriteDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2005105002867', description: 'The ID of the product' }),
    __metadata("design:type", String)
], CreateFavoriteDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_category_enum_1.ProductCategory, example: product_category_enum_1.ProductCategory.Grilovanie, description: 'The category of the product' }),
    __metadata("design:type", String)
], CreateFavoriteDto.prototype, "category", void 0);
//# sourceMappingURL=create-favorite.dto.js.map