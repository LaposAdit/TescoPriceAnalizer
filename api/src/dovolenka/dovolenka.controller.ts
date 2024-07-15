import { Controller, Get } from '@nestjs/common';
import { DovolenkaService } from './dovolenka.service';
import { Observable } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Dovolenka')
@Controller('dovolenka')
export class DovolenkaController {
    constructor(private readonly dovolenkaService: DovolenkaService) { }

    @Get('last-minute-cards')
    @ApiOperation({ summary: 'Fetch last minute cards' })
    @ApiResponse({ status: 200, description: 'Last minute cards fetched successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    getLastMinuteCards(): Observable<any> {
        return this.dovolenkaService.fetchLastMinuteCards();
    }
}
