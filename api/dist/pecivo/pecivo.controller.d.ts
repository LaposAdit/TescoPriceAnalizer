import { PecivoService } from './pecivo.service';
import { PecivoResponseDto, PecivoTransformedProductDto } from 'src/dto/pecivodto';
export declare class PecivoController {
    private readonly pecivoService;
    constructor(pecivoService: PecivoService);
    getProductsFromDb(page?: number, pageSize?: number, sale?: string): Promise<PecivoResponseDto>;
    updateAndGetProducts(): Promise<{
        message: string;
    }>;
    getProductById(productId: string): Promise<PecivoTransformedProductDto[]>;
}
