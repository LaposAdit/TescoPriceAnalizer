import { MliecneVyrobkyAVajciaService } from './mliecne-vyrobky-a-vajcia.service';
import { MliecneVyrobkyAVajciaResponseDto, MliecneVyrobkyAVajciaTransformedProductDto } from 'src/dto/mliecne-vyrobky-a-vajciadto';
export declare class MliecneVyrobkyAVajciaController {
    private readonly mliecneVyrobkyAVajciaService;
    constructor(mliecneVyrobkyAVajciaService: MliecneVyrobkyAVajciaService);
    getProductsFromDb(page?: number, pageSize?: number, sale?: string): Promise<MliecneVyrobkyAVajciaResponseDto>;
    updateAndGetProducts(): Promise<{
        message: string;
    }>;
    getProductById(productId: string): Promise<MliecneVyrobkyAVajciaTransformedProductDto[]>;
}
