export declare class PromotionDto {
    promotionId: string;
    promotionType: string;
    startDate: string;
    endDate: string;
    offerText: string;
    attributes: string[];
    promotionPrice: number | null;
}
export declare class MasoRybyALahodkyTransformedProductDto {
    productId: string;
    title: string;
    price: number;
    unitPrice: number;
    imageUrl: string;
    unitOfMeasure: string;
    isForSale: boolean;
    aisleName: string;
    promotions: PromotionDto[];
    lastUpdated: Date;
    superDepartmentName: string;
    hasPromotions: boolean;
}
export declare class MasoRybyALahodkyResponseDto {
    totalProducts: number;
    totalPages: number;
    products: MasoRybyALahodkyTransformedProductDto[];
}
