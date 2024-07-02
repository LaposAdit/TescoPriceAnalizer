import { ProductCategory } from 'src/enum/product-category.enum';
import { TescoService } from './tesco.service';
import { GenericResponse } from 'src/dto/Tesco-ResponsDTO';
export declare class TescoController {
    private readonly service;
    constructor(service: TescoService);
    getProductsAnalyticsFromDb(category?: string, page?: number, pageSize?: number, sale?: string): Promise<GenericResponse<any>>;
    calculateAnalytics(category: string): Promise<{
        message: string;
    }>;
    getProductsFromDb(category?: string, page?: number, pageSize?: number, sale?: string, randomize?: string): Promise<any>;
    searchProductsByNameWithAnalytics(searchTerm: string, page?: number, pageSize?: number, sale?: string, category?: ProductCategory): Promise<any>;
    searchProductsByName(searchTerm: string, page?: number, pageSize?: number, sale?: string, category?: ProductCategory): Promise<any>;
    getProductById(category: ProductCategory, productId: string): Promise<any[]>;
}
