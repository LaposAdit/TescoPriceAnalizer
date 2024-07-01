import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { MasoRybyALahodkyResponseDto, MasoRybyALahodkyTransformedProductDto } from 'src/dto/MasoRybyALahodkyDTO';
export declare class MasoRybyALahodkyService {
    private readonly httpService;
    private readonly prisma;
    private cookies;
    private csrfToken;
    constructor(httpService: HttpService, prisma: PrismaService);
    private fetchProductsFromApi;
    private extractPromotionPrice;
    private transformData;
    private saveProductsToDb;
    getProducts(update: boolean, page: number, pageSize: number, sale?: boolean): Promise<MasoRybyALahodkyResponseDto>;
    updateProductsFromApi(): Promise<void>;
    getProductById(productId: string): Promise<MasoRybyALahodkyTransformedProductDto[]>;
}
