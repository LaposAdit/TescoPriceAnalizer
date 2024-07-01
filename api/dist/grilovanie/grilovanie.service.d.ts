import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { GrilovanieResponseDto, GrillovaneTransformedProductDto } from 'src/dto/grilovanie-response.dto';
export declare class GrilovanieService {
    private readonly httpService;
    private readonly prisma;
    private cookies;
    private csrfToken;
    constructor(httpService: HttpService, prisma: PrismaService);
    private refreshCookiesAndCsrfToken;
    private fetchProductsFromApi;
    private extractPromotionPrice;
    private transformData;
    private saveProductsToDb;
    getProducts(update: boolean, page: number, pageSize: number, sale?: boolean): Promise<GrilovanieResponseDto>;
    updateProductsFromApi(): Promise<void>;
    getProductById(productId: string): Promise<GrillovaneTransformedProductDto[]>;
}
