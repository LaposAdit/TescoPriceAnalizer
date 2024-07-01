import { AlkoholService } from './alkohol.service';
import { AlkoholResponseDto, AlkoholTransformedProductDto } from 'src/dto/AlkoholDTO';
export declare class AlkoholController {
    private readonly alkoholService;
    constructor(alkoholService: AlkoholService);
    getProductsFromDb(page?: number, pageSize?: number, sale?: string): Promise<AlkoholResponseDto>;
    updateAndGetProducts(): Promise<{
        message: string;
    }>;
    getProductById(productId: string): Promise<AlkoholTransformedProductDto[]>;
}
