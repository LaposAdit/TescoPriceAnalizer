import { ProductCategory } from 'src/enum/product-category.enum';
import { TescoService } from './tesco.service';
import { GenericResponse } from 'src/dto/Tesco-ResponsDTO';
export declare class TescoController {
    private readonly service;
    constructor(service: TescoService);
    getProductsAnalyticsFromDb(category?: string, page?: number, pageSize?: number, sale?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', minPriceDrop?: number, maxPriceIncrease?: number, minPercentageChange?: number, isBuyRecommended?: 'yes' | 'no' | 'neutral', isOnSale?: boolean, priceChangeStatus?: 'decreased' | 'increased' | 'unchanged'): Promise<GenericResponse<any>>;
    getProductsFromDb(category?: string, page?: number, pageSize?: number, sale?: string): Promise<GenericResponse<any>>;
    searchProductsByNameWithAnalytics(searchTerm: string, page?: number, pageSize?: number, sale?: string, category?: ProductCategory, sortBy?: string, sortOrder?: 'asc' | 'desc', minPriceDrop?: number, maxPriceIncrease?: number, minPercentageChange?: number, isBuyRecommended?: 'yes' | 'no' | 'neutral', isOnSale?: boolean, priceChangeStatus?: 'decreased' | 'increased' | 'unchanged'): Promise<any>;
    searchProductsByName(searchTerm: string, page?: number, pageSize?: number, sale?: string, category?: ProductCategory): Promise<any>;
    getProductById(category: ProductCategory, productId: string): Promise<any[]>;
}
