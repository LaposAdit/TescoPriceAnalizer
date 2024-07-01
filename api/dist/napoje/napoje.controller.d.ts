import { NapojeService } from './napoje.service';
import { NapojeResponseDto, NapojeTransformedProductDto } from 'src/dto/NapojeDTO';
export declare class NapojeController {
    private readonly napojeService;
    constructor(napojeService: NapojeService);
    getProductsFromDb(page?: number, pageSize?: number, sale?: string): Promise<NapojeResponseDto>;
    updateAndGetProducts(): Promise<{
        message: string;
    }>;
    getProductById(productId: string): Promise<NapojeTransformedProductDto[]>;
}
