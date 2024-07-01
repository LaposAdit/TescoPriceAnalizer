export declare class PromotionDto {
    promotionId: string;
    promotionType: string;
    startDate: string;
    endDate: string;
    offerText: string;
    attributes: string[];
    promotionPrice: number | null;
}
export declare class OvocieAZeleninyTransformedProductDto {
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
export declare class OvocieAZeleninyResponseDto {
    totalProducts: number;
    totalPages: number;
    products: OvocieAZeleninyTransformedProductDto[];
}
