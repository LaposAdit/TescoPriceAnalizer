import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { PecivoResponseDto, PecivoTransformedProductDto } from 'src/dto/pecivodto';
export declare class PecivoService {
    private readonly httpService;
    private readonly prisma;
    private cookies;
    constructor(httpService: HttpService, prisma: PrismaService);
    private fetchProductsFromApi;
    private transformData;
    private saveProductsToDb;
    getProducts(update: boolean, page: number, pageSize: number, sale?: boolean): Promise<PecivoResponseDto>;
    updateProductsFromApi(): Promise<void>;
    getProductById(productId: string): Promise<PecivoTransformedProductDto[]>;
    private extractPromotionPrice;
}
