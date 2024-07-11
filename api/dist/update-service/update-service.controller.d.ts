import { UpdateService } from './update-service.service';
export declare class UpdateController {
    private readonly updateService;
    constructor(updateService: UpdateService);
    updateAllCategories(): Promise<{
        message: string;
    }>;
}
