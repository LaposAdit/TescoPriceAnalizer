import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
export declare class DovolenkaService {
    private readonly httpService;
    private readonly apiUrl;
    constructor(httpService: HttpService);
    fetchLastMinuteCards(): Observable<any>;
}
