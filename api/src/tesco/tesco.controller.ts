import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ProductCategory } from 'src/enum/product-category.enum';
import { TescoService } from './tesco.service';
import { GenericResponse } from 'src/dto/Tesco-ResponsDTO';

@ApiTags('Products')
@Controller('products')
export class TescoController {
    constructor(private readonly service: TescoService) { }



    @Get('analytics')
    @ApiOperation({ summary: 'Get products with analytics' })
    @ApiQuery({
        name: 'category',
        required: false,
        enum: Object.values(ProductCategory),
        description: 'Product category'
    })
    @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Number of items per page', type: Number })
    @ApiQuery({ name: 'sale', required: false, description: 'Filter by sale', type: Boolean })
    @ApiQuery({ name: 'sortLastCalculated', required: false, enum: ['asc', 'desc'], description: 'Sort by lastCalculated' })
    @ApiQuery({ name: 'sortPriceChangeStatus', required: false, enum: ['asc', 'desc'], description: 'Sort by priceChangeStatus' })
    @ApiQuery({ name: 'sortIsBuyRecommended', required: false, enum: ['asc', 'desc'], description: 'Sort by isBuyRecommended' })
    @ApiQuery({ name: 'sortPercentageChange', required: false, enum: ['asc', 'desc'], description: 'Sort by percentageChange' })
    @ApiQuery({ name: 'sortUpdatedAt', required: false, enum: ['asc', 'desc'], description: 'Sort by updatedAt' })
    @ApiQuery({ name: 'sortAveragePrice', required: false, enum: ['asc', 'desc'], description: 'Sort by averagePrice' })
    @ApiQuery({
        name: 'priceChangeStatus',
        required: false,
        enum: ['decreased', 'increased', 'unchanged'],
        description: 'Filter by price change status'
    })
    @ApiResponse({ status: 200, description: 'The products with analytics have been successfully fetched from the database.', type: Object })
    async getProductsAnalyticsFromDb(
        @Query('category') category: string = 'all',
        @Query('page') page = 1,
        @Query('pageSize') pageSize = 25,
        @Query('sale') sale?: string,
        @Query('sortLastCalculated') sortLastCalculated?: 'asc' | 'desc',
        @Query('sortPriceChangeStatus') sortPriceChangeStatus?: 'asc' | 'desc',
        @Query('sortIsBuyRecommended') sortIsBuyRecommended?: 'asc' | 'desc',
        @Query('sortPercentageChange') sortPercentageChange?: 'asc' | 'desc',
        @Query('sortUpdatedAt') sortUpdatedAt?: 'asc' | 'desc',
        @Query('sortAveragePrice') sortAveragePrice?: 'asc' | 'desc',
        @Query('priceChangeStatus') priceChangeStatus?: 'decreased' | 'increased' | 'unchanged'
    ): Promise<GenericResponse<any>> {
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;

        const sortFields = [
            { field: 'lastCalculated', order: sortLastCalculated },
            { field: 'priceChangeStatus', order: sortPriceChangeStatus },
            { field: 'isBuyRecommended', order: sortIsBuyRecommended },
            { field: 'percentageChange', order: sortPercentageChange },
            { field: 'updatedAt', order: sortUpdatedAt },
            { field: 'averagePrice', order: sortAveragePrice },
        ]
            .filter(item => item.order !== undefined)
            .map(item => ({ field: item.field, order: item.order as 'asc' | 'desc' }));

        return this.service.getProductsAnalytics(category, page, pageSize, saleBoolean, false, sortFields, priceChangeStatus);
    }



    @Get('search/analytics')
    @ApiOperation({ summary: 'Search products by name with analytics' })
    @ApiQuery({ name: 'searchTerm', required: true, description: 'Search term for product title' })
    @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number, example: 1 })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Number of items per page', type: Number, example: 25 })
    @ApiQuery({ name: 'sale', required: false, description: 'Filter by sale', type: Boolean })
    @ApiQuery({
        name: 'category',
        required: false,
        enum: Object.values(ProductCategory),
        description: 'Product category'
    })
    @ApiQuery({ name: 'sortLastCalculated', required: false, enum: ['asc', 'desc'], description: 'Sort by lastCalculated' })
    @ApiQuery({ name: 'sortPriceChangeStatus', required: false, enum: ['asc', 'desc'], description: 'Sort by priceChangeStatus' })
    @ApiQuery({ name: 'sortIsBuyRecommended', required: false, enum: ['asc', 'desc'], description: 'Sort by isBuyRecommended' })
    @ApiQuery({ name: 'sortPercentageChange', required: false, enum: ['asc', 'desc'], description: 'Sort by percentageChange' })
    @ApiQuery({ name: 'sortUpdatedAt', required: false, enum: ['asc', 'desc'], description: 'Sort by updatedAt' })
    @ApiQuery({ name: 'sortAveragePrice', required: false, enum: ['asc', 'desc'], description: 'Sort by averagePrice' })
    @ApiResponse({ status: 200, description: 'List of products matching the search term with analytics' })
    async searchProductsByNameWithAnalytics(
        @Query('searchTerm') searchTerm: string,
        @Query('page') page = 1,
        @Query('pageSize') pageSize = 25,
        @Query('sale') sale?: string,
        @Query('category') category?: string,
        @Query('sortLastCalculated') sortLastCalculated?: 'asc' | 'desc',
        @Query('sortPriceChangeStatus') sortPriceChangeStatus?: 'asc' | 'desc',
        @Query('sortIsBuyRecommended') sortIsBuyRecommended?: 'asc' | 'desc',
        @Query('sortPercentageChange') sortPercentageChange?: 'asc' | 'desc',
        @Query('sortUpdatedAt') sortUpdatedAt?: 'asc' | 'desc',
        @Query('sortAveragePrice') sortAveragePrice?: 'asc' | 'desc'
    ) {
        console.log("Analytics search request received with term:", searchTerm);
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;

        const sortFields = [
            { field: 'lastCalculated', order: sortLastCalculated },
            { field: 'priceChangeStatus', order: sortPriceChangeStatus },
            { field: 'isBuyRecommended', order: sortIsBuyRecommended },
            { field: 'percentageChange', order: sortPercentageChange },
            { field: 'updatedAt', order: sortUpdatedAt },
            { field: 'averagePrice', order: sortAveragePrice },
        ]
            .filter(item => item.order !== undefined)
            .map(item => ({ field: item.field, order: item.order as 'asc' | 'desc' }));

        return this.service.searchProductsByNameWithAnalytics(
            searchTerm,
            Number(page),
            Number(pageSize),
            saleBoolean,
            category,
            sortFields
        );
    }

    @Get('analytics/:productId')
    @ApiOperation({ summary: 'Get analytics data for a specific product' })
    @ApiParam({ name: 'productId', required: true, description: 'ID of the product' })
    @ApiResponse({ status: 200, description: 'Analytics data for the specified product' })
    @ApiResponse({ status: 404, description: 'Product analytics not found' })
    async getAnalyticsByProductId(@Param('productId') productId: string) {
        return this.service.getAnalyticsByProductId(productId);
    }


    @Post('calculate-analytics')
    @ApiOperation({ summary: 'Calculate and store analytics for products' })
    @ApiQuery({ name: 'category', required: true, enum: ['all', 'trvanlivePotraviny', 'specialnaAZdravaVyziva', 'pecivo', 'ovocieAZeleniny', 'napoje', 'mrazenePotraviny', 'mliecneVyrobkyAVajcia', 'masoRybyALahodky', 'grilovanie', 'alkohol', 'starostlivostODomacnost', 'zdravieAKrasa'] })
    @ApiResponse({ status: 200, description: 'Analytics calculated and stored successfully' })
    async calculateAnalytics(@Query('category') category: string) {
        if (category === 'all') {
            const categories = ['trvanlivePotraviny', 'specialnaAZdravaVyziva', 'pecivo', 'ovocieAZeleniny', 'napoje', 'mrazenePotraviny', 'mliecneVyrobkyAVajcia', 'masoRybyALahodky', 'grilovanie', 'alkohol', 'starostlivostODomacnost', 'zdravieAKrasa'];
            for (const cat of categories) {
                await this.service.calculateAndStoreAnalytics(cat);
            }
        } else {
            await this.service.calculateAndStoreAnalytics(category);
        }
        return { message: 'Analytics calculated and stored successfully' };
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
    @ApiQuery({ name: 'randomize', required: false, description: 'Randomize the order of products', type: Boolean })
    @ApiResponse({ status: 200, description: 'The products have been successfully fetched from the database.', type: Object })
    async getProductsFromDb(
        @Query('category') category: string = 'all',
        @Query('page') page = 1,
        @Query('pageSize') pageSize = 25,
        @Query('sale') sale?: string,
        @Query('randomize') randomize?: string
    ): Promise<any> {
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;
        const randomizeBoolean = randomize === 'true';

        return this.service.getProducts(category, page, pageSize, saleBoolean, randomizeBoolean);
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


