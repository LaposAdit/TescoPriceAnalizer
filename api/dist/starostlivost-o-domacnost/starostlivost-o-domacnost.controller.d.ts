import { StarostlivostODomacnostService } from './starostlivost-o-domacnost.service';
import { StarostlivostODomacnostResponseDto, StarostlivostODomacnostTransformedProductDto } from 'src/dto/starostlivost-o-domacnostDTO';
export declare class StarostlivostODomacnostController {
    private readonly StarostlivostODomacnostService;
    constructor(StarostlivostODomacnostService: StarostlivostODomacnostService);
    getProductsFromDb(page?: number, pageSize?: number, sale?: string): Promise<StarostlivostODomacnostResponseDto>;
    updateAndGetProducts(): Promise<{
        message: string;
    }>;
    getProductById(productId: string): Promise<StarostlivostODomacnostTransformedProductDto[]>;
}
