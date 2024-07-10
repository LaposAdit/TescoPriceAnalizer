import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { StarostlivostODomacnostService } from './starostlivost-o-domacnost.service';
import { StarostlivostODomacnostResponseDto, StarostlivostODomacnostTransformedProductDto } from 'src/dto/starostlivost-o-domacnostDTO';

@Controller('starostlivost-o-domacnost')




@ApiTags('Starostlivost a domácnost')
@Controller('starostlivost-o-domacnost')
export class StarostlivostODomacnostController {
    constructor(private readonly StarostlivostODomacnostService: StarostlivostODomacnostService) { }


    @Get()
    @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Number of items per page', type: Number })
    @ApiQuery({ name: 'sale', required: false, description: 'Filter by sale', type: Boolean })
    @ApiResponse({ status: 200, description: 'The products have been successfully fetched from the database.', type: StarostlivostODomacnostResponseDto })
    async getProductsFromDb(
        @Query('page') page = 1,
        @Query('pageSize') pageSize = 25,
        @Query('sale') sale?: string // Change type to string to handle conversion
    ): Promise<StarostlivostODomacnostResponseDto> {
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;
        return this.StarostlivostODomacnostService.getProducts(false, Number(page), Number(pageSize), saleBoolean);
    }



    @Get('update')
    @ApiResponse({ status: 200, description: 'The products have been successfully updated from the API.' })
    async updateAndGetProducts(): Promise<{ message: string }> {
        await this.StarostlivostODomacnostService.updateProductsFromApi();
        return { message: 'The products have been successfully updated from the API.' };
    }



    @Get(':productId')
    @ApiResponse({ status: 200, description: 'The product history has been successfully fetched from the database.', type: [StarostlivostODomacnostTransformedProductDto] })
    async getProductById(@Param('productId') productId: string): Promise<StarostlivostODomacnostTransformedProductDto[]> {
        return this.StarostlivostODomacnostService.getProductById(productId);
    }
}
