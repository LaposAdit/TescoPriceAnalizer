import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { StarostlivostODomacnostTransformedProductDto, StarostlivostODomacnostResponseDto } from 'src/dto/starostlivost-o-domacnostDTO';
export declare class StarostlivostODomacnostService {
    private readonly httpService;
    private readonly prisma;
    private cookies;
    constructor(httpService: HttpService, prisma: PrismaService);
    private fetchProductsFromApi;
    private extractPromotionPrice;
    private transformData;
    private saveProductsToDb;
    getProducts(update: boolean, page: number, pageSize: number, sale?: boolean): Promise<StarostlivostODomacnostResponseDto>;
    updateProductsFromApi(): Promise<void>;
    getProductById(productId: string): Promise<StarostlivostODomacnostTransformedProductDto[]>;
}
