import { Controller, Post, Body, Param, Delete, Get, Patch, ParseIntPipe, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingListDTO, ShoppingListItemDTO, AddToShoppingListResponseDTO, ShoppingListDeleteResponseDTO, UpdateShoppingListSharingDTO } from 'src/dto/ShopingListDTO';

@ApiTags('Shopping List')
@Controller('shopping-list')
export class ShoppingListController {
    constructor(private readonly shoppingListService: ShoppingListService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new shopping list' })
    @ApiResponse({ status: 201, description: 'The shopping list has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Invalid input.' })
    @ApiBody({ type: ShoppingListDTO })
    async createShoppingList(@Body() dto: ShoppingListDTO) {
        return this.shoppingListService.createShoppingList(dto);
    }

    @Post('item')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Add an item to the shopping list' })
    @ApiResponse({ status: 200, description: 'The item has been successfully added to the shopping list or an error occurred.', type: AddToShoppingListResponseDTO })
    @ApiBody({ type: ShoppingListItemDTO })
    async addItemToShoppingList(@Body() dto: ShoppingListItemDTO): Promise<AddToShoppingListResponseDTO> {
        return this.shoppingListService.addItemToShoppingList(dto);
    }

    @Delete('item/:shoppingListId/:productId')
    @ApiOperation({ summary: 'Remove an item from the shopping list' })
    @ApiResponse({ status: 200, description: 'The item has been successfully removed from the shopping list.' })
    @ApiParam({ name: 'shoppingListId', type: Number, description: 'The ID of the shopping list' })
    @ApiParam({ name: 'productId', type: String, description: 'The ID of the product' })
    async removeItemFromShoppingList(
        @Param('shoppingListId', ParseIntPipe) shoppingListId: number,
        @Param('productId') productId: string
    ) {
        return this.shoppingListService.removeItemFromShoppingList(shoppingListId, productId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a shopping list' })
    @ApiResponse({ status: 200, description: 'The shopping list has been successfully deleted or not found.', type: ShoppingListDeleteResponseDTO })
    @ApiParam({ name: 'id', type: Number, description: 'The ID of the shopping list' })
    async deleteShoppingList(@Param('id', ParseIntPipe) id: number): Promise<ShoppingListDeleteResponseDTO> {
        return this.shoppingListService.deleteShoppingList(id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a shopping list by ID' })
    @ApiResponse({ status: 200, description: 'The shopping list has been successfully retrieved.' })
    @ApiResponse({ status: 404, description: 'Shopping list not found.' })
    @ApiParam({ name: 'id', type: Number, description: 'The ID of the shopping list' })
    async getShoppingListById(@Param('id', ParseIntPipe) id: number) {
        return this.shoppingListService.getShoppingListById(id);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get all shopping lists for a user' })
    @ApiResponse({ status: 200, description: 'The shopping lists have been successfully retrieved.' })
    @ApiParam({ name: 'userId', type: String, description: 'The ID of the user' })
    async getShoppingListsByUserId(@Param('userId') userId: string) {
        return this.shoppingListService.getShoppingListsByUserId(userId);
    }

    @Get('summaries/:userId')
    @ApiOperation({ summary: 'Get shopping list summaries for a user' })
    @ApiResponse({ status: 200, description: 'Returns the shopping list summaries for the user.' })
    @ApiParam({ name: 'userId', type: String, description: 'The ID of the user' })
    async getShoppingListSummaries(@Param('userId') userId: string) {
        return this.shoppingListService.getShoppingListSummariesByUserId(userId);
    }

    @Patch(':id/share')
    @ApiOperation({ summary: 'Update the sharing status of a shopping list' })
    @ApiResponse({ status: 200, description: 'The sharing status has been successfully updated.' })
    @ApiBody({ type: UpdateShoppingListSharingDTO })
    @ApiParam({ name: 'id', type: Number, description: 'The ID of the shopping list' })
    async updateShoppingListSharing(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateShoppingListSharingDTO) {
        return this.shoppingListService.updateShoppingListSharing(id, dto.userId, dto.shared);
    }

    @Get('shared/:sharedUrlId')
    @ApiOperation({ summary: 'Get a shopping list by shared URL ID' })
    @ApiResponse({ status: 200, description: 'The shopping list has been successfully retrieved.' })
    @ApiResponse({ status: 404, description: 'Shopping list not found.' })
    @ApiParam({ name: 'sharedUrlId', type: String, description: 'The shared URL ID of the shopping list' })
    async getShoppingListBySharedUrlId(@Param('sharedUrlId') sharedUrlId: string) {
        return this.shoppingListService.getShoppingListBySharedUrlId(sharedUrlId);
    }

    @Patch('item/:shoppingListId/:productId/bought')
    @ApiOperation({ summary: 'Set an item as bought or not bought' })
    @ApiResponse({ status: 200, description: 'The item has been successfully updated.' })
    @ApiParam({ name: 'shoppingListId', type: Number, description: 'The ID of the shopping list' })
    @ApiParam({ name: 'productId', type: String, description: 'The ID of the product' })
    @ApiBody({ schema: { properties: { isBought: { type: 'boolean' } } } })
    async setItemBought(
        @Param('shoppingListId', ParseIntPipe) shoppingListId: number,
        @Param('productId') productId: string,
        @Body('isBought') isBought: boolean
    ) {
        return this.shoppingListService.setItemBought(shoppingListId, productId, isBought);
    }
}
