import { PrismaService } from '../prisma.service';
export declare class TescoService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getPrismaModel;
    private createWhereClause;
    getProducts(category: string, page: number, pageSize: number, sale?: boolean): Promise<any>;
    getProductById(category: string, productId: string): Promise<any[]>;
    private searchModelForTerm;
    searchProductsByName(searchTerm: string, page: number, pageSize: number, sale?: boolean, category?: string): Promise<any>;
    getProductsAnalytics(category: string, page: number, pageSize: number, sale?: boolean): Promise<any>;
    private calculateAnalytics;
    private transformProductWithAnalytics;
}
