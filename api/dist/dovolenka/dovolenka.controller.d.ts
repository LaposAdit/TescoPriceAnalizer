import { DovolenkaService } from './dovolenka.service';
import { Observable } from 'rxjs';
export declare class DovolenkaController {
    private readonly dovolenkaService;
    constructor(dovolenkaService: DovolenkaService);
    getLastMinuteCards(): Observable<any>;
}
