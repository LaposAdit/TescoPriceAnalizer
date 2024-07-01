import { GrillovaneTransformedProductDto, GrilovanieResponseDto } from 'src/dto/grilovanie-response.dto';
import { GrilovanieService } from './grilovanie.service';
export declare class GrilovanieController {
    private readonly grilovanieService;
    constructor(grilovanieService: GrilovanieService);
    getProductsFromDb(page?: number, pageSize?: number, sale?: string): Promise<GrilovanieResponseDto>;
    updateAndGetProducts(): Promise<{
        message: string;
    }>;
    getProductById(productId: string): Promise<GrillovaneTransformedProductDto[]>;
}
