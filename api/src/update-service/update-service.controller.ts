import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateService } from './update-service.service';

@ApiTags('Update')
@Controller('update')
export class UpdateController {
    constructor(private readonly updateService: UpdateService) { }

    @Get()
    @ApiOperation({ summary: 'Update all product categories' })
    @ApiResponse({ status: 200, description: 'All product categories have been successfully updated from the API.' })
    async updateAllCategories(): Promise<{ message: string }> {
        await this.updateService.updateAllCategories();
        return { message: 'All product categories have been successfully updated from the API.' };
    }
}