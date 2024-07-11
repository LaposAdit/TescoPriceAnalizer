import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { ZdravieAKrasaServiceResponseDto, ZdravieAKrasaServiceTransformedProductDto } from 'src/dto/zdravie-a-krasaDTO';
export declare class ZdravieAKrasaService {
    private readonly httpService;
    private readonly prisma;
    private cookies;
    constructor(httpService: HttpService, prisma: PrismaService);
    private fetchProductsFromApi;
    private extractPromotionPrice;
    private transformData;
    private saveProductsToDb;
    getProducts(update: boolean, page: number, pageSize: number, sale?: boolean): Promise<ZdravieAKrasaServiceResponseDto>;
    updateProductsFromApi(): Promise<void>;
    getProductById(productId: string): Promise<ZdravieAKrasaServiceTransformedProductDto[]>;
}
