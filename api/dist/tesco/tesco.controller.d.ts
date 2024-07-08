import { ProductCategory } from 'src/enum/product-category.enum';
import { TescoService } from './tesco.service';
import { GenericResponse } from 'src/dto/Tesco-ResponsDTO';
export declare class TescoController {
    private readonly service;
    constructor(service: TescoService);
    getProductsAnalyticsFromDb(category?: string, page?: number, pageSize?: number, sale?: string, sortLastCalculated?: 'asc' | 'desc', sortPriceChangeStatus?: 'asc' | 'desc', sortIsBuyRecommended?: 'asc' | 'desc', sortPercentageChange?: 'asc' | 'desc', sortUpdatedAt?: 'asc' | 'desc', sortAveragePrice?: 'asc' | 'desc', priceChangeStatus?: 'decreased' | 'increased' | 'unchanged'): Promise<GenericResponse<any>>;
    searchProductsByNameWithAnalytics(searchTerm: string, page?: number, pageSize?: number, sale?: string, category?: string, sortLastCalculated?: 'asc' | 'desc', sortPriceChangeStatus?: 'asc' | 'desc', sortIsBuyRecommended?: 'asc' | 'desc', sortPercentageChange?: 'asc' | 'desc', sortUpdatedAt?: 'asc' | 'desc', sortAveragePrice?: 'asc' | 'desc'): Promise<any>;
    getAnalyticsByProductId(productId: string): Promise<any>;
    calculateAnalytics(category: string): Promise<{
        message: string;
    }>;
    getProductsFromDb(category?: string, page?: number, pageSize?: number, sale?: string, randomize?: string): Promise<any>;
    searchProductsByName(searchTerm: string, page?: number, pageSize?: number, sale?: string, category?: ProductCategory): Promise<any>;
    getProductById(category: ProductCategory, productId: string): Promise<any[]>;
}
