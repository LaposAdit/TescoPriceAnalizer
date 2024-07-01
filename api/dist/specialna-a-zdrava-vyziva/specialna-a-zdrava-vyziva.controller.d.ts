import { SpecialnaAZdravaVyzivaService } from './specialna-a-zdrava-vyziva.service';
import { SpecialnaAZdravaVyzivaResponseDto, SpecialnaAZdravaVyzivaTransformedProductDto } from 'src/dto/SpecialnaAZdravaVyzivaDTO';
export declare class SpecialnaAZdravaVyzivaController {
    private readonly specialnaAZdravaVyzivaService;
    constructor(specialnaAZdravaVyzivaService: SpecialnaAZdravaVyzivaService);
    getProductsFromDb(page?: number, pageSize?: number, sale?: string): Promise<SpecialnaAZdravaVyzivaResponseDto>;
    updateAndGetProducts(): Promise<{
        message: string;
    }>;
    getProductById(productId: string): Promise<SpecialnaAZdravaVyzivaTransformedProductDto[]>;
}
