
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { ZdravieAKrasaServiceResponseDto, ZdravieAKrasaServiceTransformedProductDto } from 'src/dto/zdravie-a-krasaDTO';
import { ZdravieAKrasaService } from './zdravie-a-krasa.service';





@ApiTags('Zdravie a krása')
@Controller('zdravie-a-krasa')
export class ZdravieAKrasaController {
    constructor(private readonly zdravieAKrasaService: ZdravieAKrasaService) { }

    @Get()
    @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
    @ApiQuery({ name: 'pageSize', required: false, description: 'Number of items per page', type: Number })
    @ApiQuery({ name: 'sale', required: false, description: 'Filter by sale', type: Boolean })
    @ApiResponse({ status: 200, description: 'The products have been successfully fetched from the database.', type: ZdravieAKrasaServiceResponseDto })
    async getProductsFromDb(
        @Query('page') page = 1,
        @Query('pageSize') pageSize = 25,
        @Query('sale') sale?: string // Change type to string to handle conversion
    ): Promise<ZdravieAKrasaServiceResponseDto> {
        const saleBoolean = sale === 'true' ? true : sale === 'false' ? false : undefined;
        return this.zdravieAKrasaService.getProducts(false, Number(page), Number(pageSize), saleBoolean);
    }

    @Get('update')
    @ApiResponse({ status: 200, description: 'The products have been successfully updated from the API.' })
    async updateAndGetProducts(): Promise<{ message: string }> {
        await this.zdravieAKrasaService.updateProductsFromApi();
        return { message: 'The products have been successfully updated from the API.' };
    }

    @Get(':productId')
    @ApiResponse({ status: 200, description: 'The product history has been successfully fetched from the database.', type: [ZdravieAKrasaServiceTransformedProductDto] })
    async getProductById(@Param('productId') productId: string): Promise<ZdravieAKrasaServiceTransformedProductDto[]> {
        return this.zdravieAKrasaService.getProductById(productId);
    }
}
