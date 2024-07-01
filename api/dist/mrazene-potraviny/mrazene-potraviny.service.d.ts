import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { MrazenePotravinyResponseDto, MrazenePotravinyTransformedProductDto } from 'src/dto/MrazenePotravinyDTO';
export declare class MrazenePotravinyService {
    private readonly httpService;
    private readonly prisma;
    private cookies;
    constructor(httpService: HttpService, prisma: PrismaService);
    private fetchProductsFromApi;
    private extractPromotionPrice;
    private transformData;
    private saveProductsToDb;
    getProducts(update: boolean, page: number, pageSize: number, sale?: boolean): Promise<MrazenePotravinyResponseDto>;
    updateProductsFromApi(): Promise<void>;
    getProductById(productId: string): Promise<MrazenePotravinyTransformedProductDto[]>;
}
