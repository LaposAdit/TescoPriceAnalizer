import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { SpecialnaAZdravaVyzivaResponseDto, SpecialnaAZdravaVyzivaTransformedProductDto } from 'src/dto/SpecialnaAZdravaVyzivaDTO';
export declare class SpecialnaAZdravaVyzivaService {
    private readonly httpService;
    private readonly prisma;
    private cookies;
    constructor(httpService: HttpService, prisma: PrismaService);
    private fetchProductsFromApi;
    private extractPromotionPrice;
    private transformData;
    private saveProductsToDb;
    getProducts(update: boolean, page: number, pageSize: number, sale?: boolean): Promise<SpecialnaAZdravaVyzivaResponseDto>;
    updateProductsFromApi(): Promise<void>;
    getProductById(productId: string): Promise<SpecialnaAZdravaVyzivaTransformedProductDto[]>;
}
