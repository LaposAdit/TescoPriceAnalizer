import { OvocieAZeleninyResponseDto } from 'src/dto/ovocie-a-zeleniny-response.dto';
import { OvocieAZeleninyService } from './ovocie-a-zeleniny.service';
import { OvocieAZeleninyTransformedProductDto } from 'src/dto/ovocie-a-zeleniny-response.dto';
export declare class OvocieAZeleninyController {
    private readonly ovocieAZeleninyService;
    constructor(ovocieAZeleninyService: OvocieAZeleninyService);
    getProductsFromDb(page?: number, pageSize?: number, sale?: string): Promise<OvocieAZeleninyResponseDto>;
    updateAndGetProducts(): Promise<{
        message: string;
    }>;
    getProductById(productId: string): Promise<OvocieAZeleninyTransformedProductDto[]>;
}
