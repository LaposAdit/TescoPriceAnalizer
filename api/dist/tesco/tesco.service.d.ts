import { PrismaService } from '../prisma.service';
export declare class TescoService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private transformProduct;
    private transformProductWithAnalytics;
    private getPrismaModel;
    getProducts(category: string, page: number, pageSize: number, sale?: boolean, randomize?: boolean): Promise<any>;
    getProductById(category: string, productId: string): Promise<any[]>;
    searchProductsByName(searchTerm: string, page: number, pageSize: number, sale?: boolean, category?: string): Promise<any>;
    calculateAndStoreAnalytics(category: string): Promise<void>;
    private calculateAnalytics;
    getProductsAnalytics(category: string, page: number, pageSize: number, sale?: boolean, randomize?: boolean, sortFields?: {
        field: string;
        order: 'asc' | 'desc';
    }[]): Promise<any>;
    searchProductsByNameWithAnalytics(searchTerm: string, page: number, pageSize: number, sale?: boolean, category?: string, sortFields?: {
        field: string;
        order: 'asc' | 'desc';
    }[]): Promise<any>;
    private searchModelForTermWithAnalytics;
}
