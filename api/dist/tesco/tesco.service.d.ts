import { PrismaService } from '../prisma.service';
export declare class TescoService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private transformProduct;
    private transformProductWithAnalytics;
    private getPrismaModel;
    private createWhereClause;
    getProducts(category: string, page: number, pageSize: number, sale?: boolean): Promise<any>;
    getProductById(category: string, productId: string): Promise<any[]>;
    private searchModelForTerm;
    searchProductsByName(searchTerm: string, page: number, pageSize: number, sale?: boolean, category?: string): Promise<any>;
    getProductsAnalytics(category: string, page: number, pageSize: number, sale?: boolean, sortBy?: string, sortOrder?: 'asc' | 'desc', minPriceDrop?: number, maxPriceIncrease?: number, minPercentageChange?: number, isBuyRecommended?: 'yes' | 'no' | 'neutral', isOnSale?: boolean, priceChangeStatus?: 'decreased' | 'increased' | 'unchanged'): Promise<any>;
    private calculateAnalytics;
    searchProductsByNameWithAnalytics(searchTerm: string, page: number, pageSize: number, sale?: boolean, category?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', minPriceDrop?: number, maxPriceIncrease?: number, minPercentageChange?: number, isBuyRecommended?: 'yes' | 'no' | 'neutral', isOnSale?: boolean, priceChangeStatus?: 'decreased' | 'increased' | 'unchanged'): Promise<any>;
    private searchModelForTermWithAnalytics;
    private applyAnalyticsFilters;
    private sortProductsByAnalytics;
}
