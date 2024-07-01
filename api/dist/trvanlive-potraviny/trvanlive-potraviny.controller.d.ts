import { TrvanlivePotravinyService } from './trvanlive-potraviny.service';
import { TrvanlivePotravinyResponseDto, TrvanlivePotravinyTransformedProductDto } from 'src/dto/trvanlive-potravinyDTO';
export declare class TrvanlivePotravinyController {
    private readonly trvanlivePotravinyService;
    constructor(trvanlivePotravinyService: TrvanlivePotravinyService);
    getProductsFromDb(page?: number, pageSize?: number, sale?: string): Promise<TrvanlivePotravinyResponseDto>;
    updateAndGetProducts(): Promise<{
        message: string;
    }>;
    getProductById(productId: string): Promise<TrvanlivePotravinyTransformedProductDto[]>;
}
