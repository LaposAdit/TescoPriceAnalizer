import { MrazenePotravinyService } from './mrazene-potraviny.service';
import { MrazenePotravinyResponseDto, MrazenePotravinyTransformedProductDto } from '../dto/MrazenePotravinyDTO';
export declare class MrazenePotravinyController {
    private readonly mrazenePotravinyService;
    constructor(mrazenePotravinyService: MrazenePotravinyService);
    getProductsFromDb(page?: number, pageSize?: number, sale?: string): Promise<MrazenePotravinyResponseDto>;
    updateAndGetProducts(): Promise<{
        message: string;
    }>;
    getProductById(productId: string): Promise<MrazenePotravinyTransformedProductDto[]>;
}
