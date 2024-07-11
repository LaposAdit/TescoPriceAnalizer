import { Injectable, Logger } from '@nestjs/common';
import { TrvanlivePotravinyService } from '../trvanlive-potraviny/trvanlive-potraviny.service';
import { StarostlivostODomacnostService } from 'src/starostlivost-o-domacnost/starostlivost-o-domacnost.service';
import { PecivoService } from 'src/pecivo/pecivo.service';
import { OvocieAZeleninyService } from 'src/ovocie-a-zeleniny/ovocie-a-zeleniny.service';
import { MrazenePotravinyService } from 'src/mrazene-potraviny/mrazene-potraviny.service';
import { ZdravieAKrasaService } from 'src/zdravie-a-krasa/zdravie-a-krasa.service';
import { GrilovanieService } from 'src/grilovanie/grilovanie.service';
import { AlkoholService } from 'src/alkohol/alkohol.service';
import { MliecneVyrobkyAVajciaService } from 'src/mliecne-vyrobky-a-vajcia/mliecne-vyrobky-a-vajcia.service';
import { MasoRybyALahodkyService } from 'src/maso-ryby-a-lahodky/maso-ryby-a-lahodky.service';
import { SpecialnaAZdravaVyzivaService } from 'src/specialna-a-zdrava-vyziva/specialna-a-zdrava-vyziva.service';
import { NapojeService } from 'src/napoje/napoje.service';

@Injectable()
export class UpdateService {
    private readonly logger = new Logger(UpdateService.name);

    constructor(
        private readonly trvanlivePotravinyService: TrvanlivePotravinyService,
        private readonly starostlivostODomacnostService: StarostlivostODomacnostService,
        private readonly pecivoService: PecivoService,
        private readonly ovocieAZeleninyService: OvocieAZeleninyService,
        private readonly mrazenePotravinyService: MrazenePotravinyService,
        private readonly zdravieAKrasaService: ZdravieAKrasaService,
        private readonly grilovanieService: GrilovanieService,
        private readonly alkoholService: AlkoholService,
        private readonly mliecneVyrobkyAVajciaService: MliecneVyrobkyAVajciaService,
        private readonly masoRybyALahodkyService: MasoRybyALahodkyService,
        private readonly specialnaAZdravaVyzivaService: SpecialnaAZdravaVyzivaService,
        private readonly napoje: NapojeService,
    ) { }

    async updateAllCategories(): Promise<void> {
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
        } catch (error) {
            this.logger.error('Error updating categories', error.stack);
            throw error;
        }
    }

    private async updateCategory(categoryName: string, service: any): Promise<void> {
        try {
            this.logger.log(`Starting update for ${categoryName}`);
            const startTime = Date.now();
            await service.updateProductsFromApi();
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000; // Convert to seconds
            this.logger.log(`Finished updating ${categoryName}. Duration: ${duration.toFixed(2)} seconds`);
        } catch (error) {
            this.logger.error(`Error updating ${categoryName}`, error.stack);
            throw error;
        }
    }
}