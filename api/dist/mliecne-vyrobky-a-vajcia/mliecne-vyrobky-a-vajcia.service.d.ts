import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { MliecneVyrobkyAVajciaResponseDto, MliecneVyrobkyAVajciaTransformedProductDto } from 'src/dto/mliecne-vyrobky-a-vajciadto';
export declare class MliecneVyrobkyAVajciaService {
    private readonly httpService;
    private readonly prisma;
    private cookies;
    private csrfToken;
    constructor(httpService: HttpService, prisma: PrismaService);
    private fetchProductsFromApi;
    private extractPromotionPrice;
    private transformData;
    private saveProductsToDb;
    getProducts(update: boolean, page: number, pageSize: number, sale?: boolean): Promise<MliecneVyrobkyAVajciaResponseDto>;
    updateProductsFromApi(): Promise<void>;
    getProductById(productId: string): Promise<MliecneVyrobkyAVajciaTransformedProductDto[]>;
}
