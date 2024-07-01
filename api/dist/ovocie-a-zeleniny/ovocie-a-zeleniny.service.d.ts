import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { OvocieAZeleninyResponseDto, OvocieAZeleninyTransformedProductDto } from 'src/dto/ovocie-a-zeleniny-response.dto';
export declare class OvocieAZeleninyService {
    private readonly httpService;
    private readonly prisma;
    private cookies;
    constructor(httpService: HttpService, prisma: PrismaService);
    private fetchProductsFromApi;
    private extractPromotionPrice;
    private transformData;
    private saveProductsToDb;
    getProducts(update: boolean, page: number, pageSize: number, sale?: boolean): Promise<OvocieAZeleninyResponseDto>;
    updateProductsFromApi(): Promise<void>;
    getProductById(productId: string): Promise<OvocieAZeleninyTransformedProductDto[]>;
}
