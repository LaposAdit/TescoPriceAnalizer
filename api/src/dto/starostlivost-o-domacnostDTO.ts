export class PromotionDto {
    promotionId: string;
    promotionType: string;
    startDate: string;
    endDate: string;
    offerText: string;
    attributes: string[];
    promotionPrice: number | null; // Add this line
}

export class  StarostlivostODomacnostTransformedProductDto {
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
    hasPromotions: boolean; // Add this line
}

export class  StarostlivostODomacnostResponseDto {
    totalProducts: number;
    totalPages: number;
    products:  StarostlivostODomacnostTransformedProductDto[];
}
