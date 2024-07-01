import { MasoRybyALahodkyService } from './maso-ryby-a-lahodky.service';
import { MasoRybyALahodkyResponseDto, MasoRybyALahodkyTransformedProductDto } from 'src/dto/MasoRybyALahodkyDTO';
export declare class MasoRybyALahodkyController {
    private readonly masorybyalahodkyService;
    constructor(masorybyalahodkyService: MasoRybyALahodkyService);
    getProductsFromDb(page?: number, pageSize?: number, sale?: string): Promise<MasoRybyALahodkyResponseDto>;
    updateAndGetProducts(): Promise<{
        message: string;
    }>;
    getProductById(productId: string): Promise<MasoRybyALahodkyTransformedProductDto[]>;
}
