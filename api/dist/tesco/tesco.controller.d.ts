import { ProductCategory } from 'src/enum/product-category.enum';
import { TescoService } from './tesco.service';
import { GenericResponse } from 'src/dto/Tesco-ResponsDTO';
export declare class TescoController {
    private readonly service;
    constructor(service: TescoService);
    getProductsAnalyticsFromDb(category?: string, page?: number, pageSize?: number, sale?: string, sortLastCalculated?: 'null' | 'asc' | 'desc', sortPriceChangeStatus?: 'null' | 'asc' | 'desc', sortIsBuyRecommended?: 'null' | 'asc' | 'desc', sortPercentageChange?: 'null' | 'asc' | 'desc', sortUpdatedAt?: 'null' | 'asc' | 'desc', sortAveragePrice?: 'null' | 'asc' | 'desc'): Promise<GenericResponse<any>>;
    searchProductsByNameWithAnalytics(searchTerm: string, page?: number, pageSize?: number, sale?: string, sortLastCalculated?: 'null' | 'asc' | 'desc', sortPriceChangeStatus?: 'null' | 'asc' | 'desc', sortIsBuyRecommended?: 'null' | 'asc' | 'desc', sortPercentageChange?: 'null' | 'asc' | 'desc', sortUpdatedAt?: 'null' | 'asc' | 'desc', sortAveragePrice?: 'null' | 'asc' | 'desc'): Promise<any>;
    calculateAnalytics(category: string): Promise<{
        message: string;
    }>;
    getProductsFromDb(category?: string, page?: number, pageSize?: number, sale?: string, randomize?: string): Promise<any>;
    searchProductsByName(searchTerm: string, page?: number, pageSize?: number, sale?: string, category?: ProductCategory): Promise<any>;
    getProductById(category: ProductCategory, productId: string): Promise<any[]>;
}
