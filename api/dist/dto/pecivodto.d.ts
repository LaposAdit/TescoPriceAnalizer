export declare class PromotionDto {
    promotionId: string;
    promotionType: string;
    startDate: string;
    endDate: string;
    offerText: string;
    attributes: string[];
    promotionPrice: number | null;
}
export declare class PecivoTransformedProductDto {
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
export declare class PecivoResponseDto {
    totalProducts: number;
    totalPages: number;
    products: PecivoTransformedProductDto[];
}
