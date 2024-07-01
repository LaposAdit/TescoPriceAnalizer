"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const ovocie_a_zeleniny_controller_1 = require("./ovocie-a-zeleniny/ovocie-a-zeleniny.controller");
const ovocie_a_zeleniny_service_1 = require("./ovocie-a-zeleniny/ovocie-a-zeleniny.service");
const axios_1 = require("@nestjs/axios");
const grilovanie_controller_1 = require("./grilovanie/grilovanie.controller");
const grilovanie_service_1 = require("./grilovanie/grilovanie.service");
const prisma_service_1 = require("./prisma.service");
const mliecne_vyrobky_a_vajcia_controller_1 = require("./mliecne-vyrobky-a-vajcia/mliecne-vyrobky-a-vajcia.controller");
const mliecne_vyrobky_a_vajcia_service_1 = require("./mliecne-vyrobky-a-vajcia/mliecne-vyrobky-a-vajcia.service");
const pecivo_controller_1 = require("./pecivo/pecivo.controller");
const pecivo_service_1 = require("./pecivo/pecivo.service");
const maso_ryby_a_lahodky_controller_1 = require("./maso-ryby-a-lahodky/maso-ryby-a-lahodky.controller");
const maso_ryby_a_lahodky_service_1 = require("./maso-ryby-a-lahodky/maso-ryby-a-lahodky.service");
const trvanlive_potraviny_controller_1 = require("./trvanlive-potraviny/trvanlive-potraviny.controller");
const trvanlive_potraviny_service_1 = require("./trvanlive-potraviny/trvanlive-potraviny.service");
const specialna_a_zdrava_vyziva_controller_1 = require("./specialna-a-zdrava-vyziva/specialna-a-zdrava-vyziva.controller");
const specialna_a_zdrava_vyziva_service_1 = require("./specialna-a-zdrava-vyziva/specialna-a-zdrava-vyziva.service");
const mrazene_potraviny_controller_1 = require("./mrazene-potraviny/mrazene-potraviny.controller");
const mrazene_potraviny_service_1 = require("./mrazene-potraviny/mrazene-potraviny.service");
const napoje_controller_1 = require("./napoje/napoje.controller");
const napoje_service_1 = require("./napoje/napoje.service");
const alkohol_controller_1 = require("./alkohol/alkohol.controller");
const alkohol_service_1 = require("./alkohol/alkohol.service");
const tesco_controller_1 = require("./tesco/tesco.controller");
const tesco_service_1 = require("./tesco/tesco.service");
const favorite_service_1 = require("./favorite/favorite.service");
const favorite_controller_1 = require("./favorite/favorite.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        controllers: [app_controller_1.AppController, ovocie_a_zeleniny_controller_1.OvocieAZeleninyController, grilovanie_controller_1.GrilovanieController, mliecne_vyrobky_a_vajcia_controller_1.MliecneVyrobkyAVajciaController, pecivo_controller_1.PecivoController, maso_ryby_a_lahodky_controller_1.MasoRybyALahodkyController, trvanlive_potraviny_controller_1.TrvanlivePotravinyController, specialna_a_zdrava_vyziva_controller_1.SpecialnaAZdravaVyzivaController, mrazene_potraviny_controller_1.MrazenePotravinyController, napoje_controller_1.NapojeController, alkohol_controller_1.AlkoholController, tesco_controller_1.TescoController, favorite_controller_1.FavoriteController],
        providers: [app_service_1.AppService, ovocie_a_zeleniny_service_1.OvocieAZeleninyService, grilovanie_service_1.GrilovanieService, prisma_service_1.PrismaService, mliecne_vyrobky_a_vajcia_service_1.MliecneVyrobkyAVajciaService, pecivo_service_1.PecivoService, maso_ryby_a_lahodky_service_1.MasoRybyALahodkyService, trvanlive_potraviny_service_1.TrvanlivePotravinyService, specialna_a_zdrava_vyziva_service_1.SpecialnaAZdravaVyzivaService, mrazene_potraviny_service_1.MrazenePotravinyService, napoje_service_1.NapojeService, alkohol_service_1.AlkoholService, tesco_service_1.TescoService, favorite_service_1.FavoriteService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map