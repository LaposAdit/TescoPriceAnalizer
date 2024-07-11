import { ZdravieAKrasaServiceResponseDto, ZdravieAKrasaServiceTransformedProductDto } from 'src/dto/zdravie-a-krasaDTO';
import { ZdravieAKrasaService } from './zdravie-a-krasa.service';
export declare class ZdravieAKrasaController {
    private readonly zdravieAKrasaService;
    constructor(zdravieAKrasaService: ZdravieAKrasaService);
    getProductsFromDb(page?: number, pageSize?: number, sale?: string): Promise<ZdravieAKrasaServiceResponseDto>;
    updateAndGetProducts(): Promise<{
        message: string;
    }>;
    getProductById(productId: string): Promise<ZdravieAKrasaServiceTransformedProductDto[]>;
}
