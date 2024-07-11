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
exports.UpdateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_service_service_1 = require("./update-service.service");
let UpdateController = class UpdateController {
    constructor(updateService) {
        this.updateService = updateService;
    }
    async updateAllCategories() {
        await this.updateService.updateAllCategories();
        return { message: 'All product categories have been successfully updated from the API.' };
    }
};
exports.UpdateController = UpdateController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update all product categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All product categories have been successfully updated from the API.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UpdateController.prototype, "updateAllCategories", null);
exports.UpdateController = UpdateController = __decorate([
    (0, swagger_1.ApiTags)('Update'),
    (0, common_1.Controller)('update'),
    __metadata("design:paramtypes", [update_service_service_1.UpdateService])
], UpdateController);
//# sourceMappingURL=update-service.controller.js.map