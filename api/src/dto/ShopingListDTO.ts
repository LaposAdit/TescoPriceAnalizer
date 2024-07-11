import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory } from 'src/enum/product-category.enum';

export class ShoppingListDTO {
    @ApiProperty({ example: 'Lunch', description: 'The name of the shopping list' })
    name: string;

    @ApiProperty({ example: 'user123', description: 'The ID of the user' })
    userId: string;
}

export class ShoppingListItemDTO {
    @ApiProperty({ example: 1, description: 'The ID of the shopping list' })
    shoppingListId: number;

    @ApiProperty({ example: 'product123', description: 'The ID of the product' })
    productId: string;

    @ApiProperty({ example: 1, description: 'The quantity of the product' })
    quantity: number;

    @ApiProperty({ enum: ProductCategory, example: ProductCategory.SpecialnaAZdravaVyziva, description: 'The category of the product' })
    category: ProductCategory;
}

export class ShoppingListItemResponseDTO {
    @ApiProperty({ example: 1, description: 'The ID of the shopping list item' })
    id: number;

    @ApiProperty({ example: 1, description: 'The ID of the shopping list' })
    shoppingListId: number;

    @ApiProperty({ example: 'Lunch', description: 'The name of the shopping list' })
    shoppingListName: string;

    @ApiProperty({ example: 'product123', description: 'The ID of the product' })
    productId: string;

    @ApiProperty({ example: 2, description: 'The quantity of the product' })
    quantity: number;

    @ApiProperty({ enum: ProductCategory, example: ProductCategory.SpecialnaAZdravaVyziva, description: 'The category of the product' })
    category: ProductCategory;

    @ApiProperty({ example: '2023-07-11T12:00:00Z', description: 'The creation date of the shopping list item' })
    createdAt: Date;

    @ApiProperty({ example: '2023-07-11T12:00:00Z', description: 'The last update date of the shopping list item' })
    updatedAt: Date;
}

export class AddToShoppingListResponseDTO {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    success: boolean;

    @ApiProperty({ example: 'Item successfully added to shopping list', description: 'A message describing the result of the operation' })
    message: string;

    @ApiProperty({ type: ShoppingListItemResponseDTO, description: 'The details of the added or updated shopping list item', required: false })
    data: ShoppingListItemResponseDTO | null;

    @ApiProperty({ example: 'Error message', description: 'Error message if operation failed', required: false })
    error?: string;
}

export class ShoppingListDeleteResponseDTO {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    success: boolean;

    @ApiProperty({ example: 'Shopping list successfully deleted', description: 'A message describing the result of the operation' })
    message: string;

    @ApiProperty({ example: { id: 1, itemsDeleted: 5 }, description: 'Additional data about the delete operation', required: false })
    data?: {
        id: number;
        itemsDeleted: number;
    };
}

export class UpdateShoppingListSharingDTO {
    @ApiProperty({ example: 'user123', description: 'The ID of the user' })
    userId: string;

    @ApiProperty({ example: true, description: 'Indicates if the shopping list should be shared' })
    shared: boolean;
}