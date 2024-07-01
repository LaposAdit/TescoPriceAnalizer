import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { AlkoholResponseDto, AlkoholTransformedProductDto } from 'src/dto/AlkoholDTO';
export declare class AlkoholService {
    private readonly httpService;
    private readonly prisma;
    private cookies;
    constructor(httpService: HttpService, prisma: PrismaService);
    private fetchProductsFromApi;
    private extractPromotionPrice;
    private transformData;
    private saveProductsToDb;
    getProducts(update: boolean, page: number, pageSize: number, sale?: boolean): Promise<AlkoholResponseDto>;
    updateProductsFromApi(): Promise<void>;
    getProductById(productId: string): Promise<AlkoholTransformedProductDto[]>;
}
