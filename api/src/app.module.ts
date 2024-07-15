import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OvocieAZeleninyController } from './ovocie-a-zeleniny/ovocie-a-zeleniny.controller';
import { OvocieAZeleninyService } from './ovocie-a-zeleniny/ovocie-a-zeleniny.service';
import { HttpModule } from '@nestjs/axios';
import { GrilovanieController } from './grilovanie/grilovanie.controller';
import { GrilovanieService } from './grilovanie/grilovanie.service';
import { PrismaService } from './prisma.service';
import { MliecneVyrobkyAVajciaController } from './mliecne-vyrobky-a-vajcia/mliecne-vyrobky-a-vajcia.controller';
import { MliecneVyrobkyAVajciaService } from './mliecne-vyrobky-a-vajcia/mliecne-vyrobky-a-vajcia.service';
import { PecivoController } from './pecivo/pecivo.controller';
import { PecivoService } from './pecivo/pecivo.service';
import { MasoRybyALahodkyController } from './maso-ryby-a-lahodky/maso-ryby-a-lahodky.controller';
import { MasoRybyALahodkyService } from './maso-ryby-a-lahodky/maso-ryby-a-lahodky.service';
import { TrvanlivePotravinyController } from './trvanlive-potraviny/trvanlive-potraviny.controller';
import { TrvanlivePotravinyService } from './trvanlive-potraviny/trvanlive-potraviny.service';
import { SpecialnaAZdravaVyzivaController } from './specialna-a-zdrava-vyziva/specialna-a-zdrava-vyziva.controller';
import { SpecialnaAZdravaVyzivaService } from './specialna-a-zdrava-vyziva/specialna-a-zdrava-vyziva.service';
import { MrazenePotravinyController } from './mrazene-potraviny/mrazene-potraviny.controller';
import { MrazenePotravinyService } from './mrazene-potraviny/mrazene-potraviny.service';
import { NapojeController } from './napoje/napoje.controller';
import { NapojeService } from './napoje/napoje.service';
import { AlkoholController } from './alkohol/alkohol.controller';
import { AlkoholService } from './alkohol/alkohol.service';
import { TescoController } from './tesco/tesco.controller';
import { TescoService } from './tesco/tesco.service';
import { FavoriteService } from './favorite/favorite.service';
import { FavoriteController } from './favorite/favorite.controller';
import { StarostlivostODomacnostService } from './starostlivost-o-domacnost/starostlivost-o-domacnost.service';
import { StarostlivostODomacnostController } from './starostlivost-o-domacnost/starostlivost-o-domacnost.controller';
import { ZdravieAKrasaService } from './zdravie-a-krasa/zdravie-a-krasa.service';
import { ZdravieAKrasaController } from './zdravie-a-krasa/zdravie-a-krasa.controller';
import { UpdateService } from './update-service/update-service.service';
import { UpdateController } from './update-service/update-service.controller';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { ShoppingListController } from './shopping-list/shopping-list.controller';
import { DovolenkaService } from './dovolenka/dovolenka.service';
import { DovolenkaController } from './dovolenka/dovolenka.controller';

@Module({
  imports: [HttpModule],
  controllers: [AppController, OvocieAZeleninyController, GrilovanieController, MliecneVyrobkyAVajciaController, PecivoController, MasoRybyALahodkyController, TrvanlivePotravinyController, SpecialnaAZdravaVyzivaController, MrazenePotravinyController, NapojeController, AlkoholController, TescoController, FavoriteController, StarostlivostODomacnostController, ZdravieAKrasaController, UpdateController, ShoppingListController, DovolenkaController],
  providers: [AppService, OvocieAZeleninyService, GrilovanieService, PrismaService, MliecneVyrobkyAVajciaService, PecivoService, MasoRybyALahodkyService, TrvanlivePotravinyService, SpecialnaAZdravaVyzivaService, MrazenePotravinyService, NapojeService, AlkoholService, TescoService, FavoriteService, StarostlivostODomacnostService, ZdravieAKrasaService, UpdateService, ShoppingListService, DovolenkaService],
})
export class AppModule { }
