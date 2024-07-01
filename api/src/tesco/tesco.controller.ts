import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { ProductCategory } from 'src/enum/product-category.enum';
import { TescoService } from './tesco.service';
import { GenericResponse } from 'src/dto/Tesco-ResponsDTO';

@ApiTags('Products')
@Controller('products')
export class TescoController {
    constructor(private readonly service: TescoService) { }


    @Get('analytics')
    @ApiQuery({ name: 'category', required: false, enum: Object.values(ProductCategory), description: 'Product category' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Number of items per page', type: Number })
    @ApiQuery({ name: 'sale', required: false, description: 'Filter by sale', type: Boolean })
    @ApiQuery({ name: 'sortBy', required: false, enum: ['priceDrop', 'priceIncrease', 'percentageChange', 'previousPrice', 'averagePrice'], description: 'Sort by analytics field' })
    @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
    @ApiQuery({ name: 'minPriceDrop', required: false, type: Number, description: 'Minimum price drop' })
    @ApiQuery({ name: 'maxPriceIncrease', required: false, type: Number, description: 'Maximum price increase' })
    @ApiQuery({ name: 'minPercentageChange', required: false, type: Number, description: 'Minimum percentage change' })
    @ApiQuery({ name: 'isBuyRecommended', required: false, enum: ['yes', 'no', 'neutral'], description: 'Buy recommendation' })
    @ApiQuery({ name: 'isOnSale', required: false, type: Boolean, description: 'Is on sale' })
    @ApiQuery({ name: 'priceChangeStatus', required: false, enum: ['decreased', 'increased', 'unchanged'], description: 'Price change status' })
    @ApiResponse({ status: 200, description: 'The products with analytics have been successfully fetched from the database.', type: Object })
    async getProductsAnalyticsFromDb(
        @Query('category') category: string = 'all',
        @Query('page') page = 1,
        @Query('pageSize') pageSize = 25,
        @Query('sale') sale?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: 'asc' | 'desc',
        @Query('minPriceDrop') minPriceDrop?: number,
        @Query('maxPriceIncrease') maxPriceIncrease?: number,
        @Query('minPercentageChange') minPercentageChange?: number,
        @Query('isBuyRecommended') isBuyRecommended?: 'yes' | 'no' | 'neutral',
        @Query('isOnSale') isOnSale?: boolean,
        @Query('priceChangeStatus') priceChangeStatus?: 'decreased' | 'increased' | 'unchanged'
    ): Promise<GenericResponse<any>> {
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;

        return this.service.getProductsAnalytics(
            category, page, pageSize, saleBoolean, sortBy, sortOrder,
            minPriceDrop, maxPriceIncrease, minPercentageChange,
            isBuyRecommended, isOnSale, priceChangeStatus
        );
    }


    @Get()
    @ApiQuery({
        name: 'category',
        required: false,
        enum: Object.values(ProductCategory),
        description: 'Product category'
    })
    @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Number of items per page', type: Number })
    @ApiQuery({ name: 'sale', required: false, description: 'Filter by sale', type: Boolean })
    @ApiResponse({ status: 200, description: 'The products have been successfully fetched from the database.', type: Object })
    async getProductsFromDb(
        @Query('category') category: string = 'all',
        @Query('page') page = 1,
        @Query('pageSize') pageSize = 25,
        @Query('sale') sale?: string
    ): Promise<GenericResponse<any>> {
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;

        return this.service.getProducts(category, page, pageSize, saleBoolean);
    }


    @ApiOperation({ summary: 'Search products by name with analytics' })
    @ApiQuery({ name: 'searchTerm', required: true, description: 'Search term for product title' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number, example: 1 })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Number of items per page', type: Number, example: 25 })
    @ApiQuery({ name: 'sale', required: false, description: 'Filter by sale', type: Boolean })
    @ApiQuery({ name: 'category', required: false, enum: ProductCategory, description: 'Product category' })
    @ApiQuery({ name: 'sortBy', required: false, enum: ['priceDrop', 'priceIncrease', 'percentageChange', 'previousPrice', 'averagePrice'], description: 'Sort by analytics field' })
    @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
    @ApiQuery({ name: 'minPriceDrop', required: false, type: Number, description: 'Minimum price drop' })
    @ApiQuery({ name: 'maxPriceIncrease', required: false, type: Number, description: 'Maximum price increase' })
    @ApiQuery({ name: 'minPercentageChange', required: false, type: Number, description: 'Minimum percentage change' })
    @ApiQuery({ name: 'isBuyRecommended', required: false, enum: ['yes', 'no', 'neutral'], description: 'Buy recommendation' })
    @ApiQuery({ name: 'isOnSale', required: false, type: Boolean, description: 'Is on sale' })
    @ApiQuery({ name: 'priceChangeStatus', required: false, enum: ['decreased', 'increased', 'unchanged'], description: 'Price change status' })
    @ApiResponse({ status: 200, description: 'List of products matching the search term with analytics' })
    @Get('search/analytics')
    async searchProductsByNameWithAnalytics(
        @Query('searchTerm') searchTerm: string,
        @Query('page') page = 1,
        @Query('pageSize') pageSize = 25,
        @Query('sale') sale?: string,
        @Query('category') category?: ProductCategory,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: 'asc' | 'desc',
        @Query('minPriceDrop') minPriceDrop?: number,
        @Query('maxPriceIncrease') maxPriceIncrease?: number,
        @Query('minPercentageChange') minPercentageChange?: number,
        @Query('isBuyRecommended') isBuyRecommended?: 'yes' | 'no' | 'neutral',
        @Query('isOnSale') isOnSale?: boolean,
        @Query('priceChangeStatus') priceChangeStatus?: 'decreased' | 'increased' | 'unchanged'
    ) {
        console.log("Analytics search request received with term:", searchTerm);
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;
        return this.service.searchProductsByNameWithAnalytics(
            searchTerm, page, pageSize, saleBoolean, category, sortBy, sortOrder,
            minPriceDrop, maxPriceIncrease, minPercentageChange,
            isBuyRecommended, isOnSale, priceChangeStatus
        );
    }

    @ApiOperation({ summary: 'Search products by name' })
    @ApiQuery({ name: 'searchTerm', required: true, description: 'Search term for product title' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number, example: 1 })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Number of items per page', type: Number, example: 25 })
    @ApiQuery({ name: 'sale', required: false, description: 'Filter by sale', type: Boolean })
    @ApiQuery({ name: 'category', required: false, enum: ProductCategory, description: 'Product category' })
    @ApiResponse({ status: 200, description: 'List of products matching the search term' })
    @Get('search')
    async searchProductsByName(
        @Query('searchTerm') searchTerm: string,
        @Query('page') page = 1,
        @Query('pageSize') pageSize = 25,
        @Query('sale') sale?: string,
        @Query('category') category?: ProductCategory,
    ) {
        console.log("Search request received with term:", searchTerm);
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;
        return this.service.searchProductsByName(searchTerm, page, pageSize, saleBoolean, category);
    }

    @Get(':category/:productId')
    @ApiResponse({ status: 200, description: 'The product history has been successfully fetched from the database.', type: Object })
    async getProductById(@Param('category') category: ProductCategory, @Param('productId') productId: string): Promise<any[]> {
        return this.service.getProductById(category, productId);
    }
}
