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
var UpdateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateService = void 0;
const common_1 = require("@nestjs/common");
const trvanlive_potraviny_service_1 = require("../trvanlive-potraviny/trvanlive-potraviny.service");
const starostlivost_o_domacnost_service_1 = require("../starostlivost-o-domacnost/starostlivost-o-domacnost.service");
const pecivo_service_1 = require("../pecivo/pecivo.service");
const ovocie_a_zeleniny_service_1 = require("../ovocie-a-zeleniny/ovocie-a-zeleniny.service");
const mrazene_potraviny_service_1 = require("../mrazene-potraviny/mrazene-potraviny.service");
const zdravie_a_krasa_service_1 = require("../zdravie-a-krasa/zdravie-a-krasa.service");
const grilovanie_service_1 = require("../grilovanie/grilovanie.service");
const alkohol_service_1 = require("../alkohol/alkohol.service");
const mliecne_vyrobky_a_vajcia_service_1 = require("../mliecne-vyrobky-a-vajcia/mliecne-vyrobky-a-vajcia.service");
const maso_ryby_a_lahodky_service_1 = require("../maso-ryby-a-lahodky/maso-ryby-a-lahodky.service");
const specialna_a_zdrava_vyziva_service_1 = require("../specialna-a-zdrava-vyziva/specialna-a-zdrava-vyziva.service");
const napoje_service_1 = require("../napoje/napoje.service");
let UpdateService = UpdateService_1 = class UpdateService {
    constructor(trvanlivePotravinyService, starostlivostODomacnostService, pecivoService, ovocieAZeleninyService, mrazenePotravinyService, zdravieAKrasaService, grilovanieService, alkoholService, mliecneVyrobkyAVajciaService, masoRybyALahodkyService, specialnaAZdravaVyzivaService, napoje) {
        this.trvanlivePotravinyService = trvanlivePotravinyService;
        this.starostlivostODomacnostService = starostlivostODomacnostService;
        this.pecivoService = pecivoService;
        this.ovocieAZeleninyService = ovocieAZeleninyService;
        this.mrazenePotravinyService = mrazenePotravinyService;
        this.zdravieAKrasaService = zdravieAKrasaService;
        this.grilovanieService = grilovanieService;
        this.alkoholService = alkoholService;
        this.mliecneVyrobkyAVajciaService = mliecneVyrobkyAVajciaService;
        this.masoRybyALahodkyService = masoRybyALahodkyService;
        this.specialnaAZdravaVyzivaService = specialnaAZdravaVyzivaService;
        this.napoje = napoje;
        this.logger = new common_1.Logger(UpdateService_1.name);
    }
    async updateAllCategories() {
        this.logger.log('Starting update of all categories');
        const updateTasks = [
            this.updateCategory('Trvanlivé Potraviny', this.trvanlivePotravinyService),
            this.updateCategory('Starostlivosť o Domácnosť', this.starostlivostODomacnostService),
            this.updateCategory('Pečivo', this.pecivoService),
            this.updateCategory('Ovocie a Zeleniny', this.ovocieAZeleninyService),
            this.updateCategory('Mrazené Potraviny', this.mrazenePotravinyService),
            this.updateCategory('Alkohol', this.alkoholService),
            this.updateCategory('Zdravie a Krása', this.zdravieAKrasaService),
            this.updateCategory('Grilovanie', this.grilovanieService),
            this.updateCategory('Mliečne Výrobky a Vajcia', this.mliecneVyrobkyAVajciaService),
            this.updateCategory('Mäso, Ryby a Lahôdky', this.masoRybyALahodkyService),
            this.updateCategory('Špeciálna a Zdravá Výživa', this.specialnaAZdravaVyzivaService),
            this.updateCategory('Nápoje', this.napoje),
        ];
        try {
            await Promise.all(updateTasks);
            this.logger.log('All categories updated successfully');
        }
        catch (error) {
            this.logger.error('Error updating categories', error.stack);
            throw error;
        }
    }
    async updateCategory(categoryName, service) {
        try {
            this.logger.log(`Starting update for ${categoryName}`);
            const startTime = Date.now();
            await service.updateProductsFromApi();
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;
            this.logger.log(`Finished updating ${categoryName}. Duration: ${duration.toFixed(2)} seconds`);
        }
        catch (error) {
            this.logger.error(`Error updating ${categoryName}`, error.stack);
            throw error;
        }
    }
};
exports.UpdateService = UpdateService;
exports.UpdateService = UpdateService = UpdateService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [trvanlive_potraviny_service_1.TrvanlivePotravinyService,
        starostlivost_o_domacnost_service_1.StarostlivostODomacnostService,
        pecivo_service_1.PecivoService,
        ovocie_a_zeleniny_service_1.OvocieAZeleninyService,
        mrazene_potraviny_service_1.MrazenePotravinyService,
        zdravie_a_krasa_service_1.ZdravieAKrasaService,
        grilovanie_service_1.GrilovanieService,
        alkohol_service_1.AlkoholService,
        mliecne_vyrobky_a_vajcia_service_1.MliecneVyrobkyAVajciaService,
        maso_ryby_a_lahodky_service_1.MasoRybyALahodkyService,
        specialna_a_zdrava_vyziva_service_1.SpecialnaAZdravaVyzivaService,
        napoje_service_1.NapojeService])
], UpdateService);
//# sourceMappingURL=update-service.service.js.map