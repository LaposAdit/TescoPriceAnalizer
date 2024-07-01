import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { TrvanlivePotravinyResponseDto, TrvanlivePotravinyTransformedProductDto } from 'src/dto/trvanlive-potravinyDTO';
export declare class TrvanlivePotravinyService {
    private readonly httpService;
    private readonly prisma;
    private cookies;
    constructor(httpService: HttpService, prisma: PrismaService);
    private fetchProductsFromApi;
    private extractPromotionPrice;
    private transformData;
    private saveProductsToDb;
    getProducts(update: boolean, page: number, pageSize: number, sale?: boolean): Promise<TrvanlivePotravinyResponseDto>;
    updateProductsFromApi(): Promise<void>;
    getProductById(productId: string): Promise<TrvanlivePotravinyTransformedProductDto[]>;
}
