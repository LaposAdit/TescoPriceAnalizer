import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DovolenkaService {
    private readonly apiUrl = 'https://www.hydrotour.sk/sapi/last-minute-karty';

    constructor(private readonly httpService: HttpService) { }

    fetchLastMinuteCards(): Observable<any> {
        return this.httpService.get(this.apiUrl).pipe(
            map((response: AxiosResponse) => response.data)
        );
    }
}
