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
exports.DovolenkaController = void 0;
const common_1 = require("@nestjs/common");
const dovolenka_service_1 = require("./dovolenka.service");
const rxjs_1 = require("rxjs");
const swagger_1 = require("@nestjs/swagger");
let DovolenkaController = class DovolenkaController {
    constructor(dovolenkaService) {
        this.dovolenkaService = dovolenkaService;
    }
    getLastMinuteCards() {
        return this.dovolenkaService.fetchLastMinuteCards();
    }
};
exports.DovolenkaController = DovolenkaController;
__decorate([
    (0, common_1.Get)('last-minute-cards'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch last minute cards' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Last minute cards fetched successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], DovolenkaController.prototype, "getLastMinuteCards", null);
exports.DovolenkaController = DovolenkaController = __decorate([
    (0, swagger_1.ApiTags)('Dovolenka'),
    (0, common_1.Controller)('dovolenka'),
    __metadata("design:paramtypes", [dovolenka_service_1.DovolenkaService])
], DovolenkaController);
//# sourceMappingURL=dovolenka.controller.js.map