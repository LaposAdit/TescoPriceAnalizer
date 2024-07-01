import { ProductCategory } from '../enum/product-category.enum';
export declare class CreateFavoriteDto {
    userId: string;
    productId: string;
    category: ProductCategory;
}
