import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { NapojeResponseDto, NapojeTransformedProductDto } from 'src/dto/NapojeDTO';
export declare class NapojeService {
    private readonly httpService;
    private readonly prisma;
    private cookies;
    constructor(httpService: HttpService, prisma: PrismaService);
    private fetchProductsFromApi;
    private extractPromotionPrice;
    private transformData;
    private saveProductsToDb;
    getProducts(update: boolean, page: number, pageSize: number, sale?: boolean): Promise<NapojeResponseDto>;
    updateProductsFromApi(): Promise<void>;
    getProductById(productId: string): Promise<NapojeTransformedProductDto[]>;
}
