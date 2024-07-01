"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PecivoService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const prisma_service_1 = require("../prisma.service");
const header_1 = require("../common/header");
let PecivoService = class PecivoService {
    constructor(httpService, prisma) {
        this.httpService = httpService;
        this.prisma = prisma;
        this.cookies = '';
    }
    async fetchProductsFromApi() {
        const url = 'https://potravinydomov.itesco.sk/groceries/sk-SK/resources';
        const headers = { ...header_1.defaultHeaders };
        let allProducts = [];
        let count = 48;
        let page = 1;
        let morePages = true;
        while (morePages) {
            const body = {
                resources: [
                    {
                        type: 'productsByCategory',
                        params: {
                            query: { count: count.toString(), page: page.toString() },
                            superdepartment: 'pecivo'
                        },
                        hash: '8148811669619233'
                    }
                ],
                sharedParams: {
                    superdepartment: 'pecivo',
                    query: { count: count.toString(), page: page.toString() },
                    referer: `/groceries/sk-SK/shop/pecivo/all?count=${count}&page=${page - 1}`
                },
                requiresAuthentication: false
            };
            try {
                console.log(`Fetching products with page: ${page}`);
                const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, body, { headers }));
                const transformedProducts = this.transformData(response.data);
                allProducts = allProducts.concat(transformedProducts);
                morePages = allProducts.length < response.data.productsByCategory.data.results.pageInformation.totalCount;
                page += 1;
                console.log(`Total products fetched so far: ${allProducts.length}`);
            }
            catch (error) {
                console.error('Error fetching data:', error);
                throw error;
            }
        }
        return allProducts;
    }
    transformData(data) {
        const productItems = data.productsByCategory.data.results.productItems;
        if (!productItems) {
            throw new Error('Unexpected response structure');
        }
        return productItems.map((item) => {
            const product = item.product;
            const promotions = item.promotions?.map((promo) => ({
                promotionId: promo.promotionId,
                promotionType: promo.promotionType,
                startDate: promo.startDate,
                endDate: promo.endDate,
                offerText: promo.offerText,
                attributes: promo.attributes,
                promotionPrice: this.extractPromotionPrice(promo.offerText)
            })) || [];
            return {
                productId: product.id,
                title: product.title,
                price: product.price,
                unitPrice: product.unitPrice,
                imageUrl: product.defaultImageUrl,
                unitOfMeasure: product.unitOfMeasure,
                isForSale: product.isForSale,
                aisleName: product.aisleName,
                superDepartmentName: product.superDepartmentName,
                promotions,
                hasPromotions: promotions.length > 0,
                lastUpdated: new Date()
            };
        });
    }
    async saveProductsToDb(products) {
        for (const product of products) {
            try {
                await this.prisma.pecivo.create({
                    data: {
                        productId: product.productId,
                        title: product.title,
                        price: product.price,
                        unitPrice: product.unitPrice,
                        imageUrl: product.imageUrl,
                        unitOfMeasure: product.unitOfMeasure,
                        isForSale: product.isForSale,
                        aisleName: product.aisleName,
                        category: 'pecivo',
                        superDepartmentName: product.superDepartmentName,
                        hasPromotions: product.hasPromotions,
                        promotions: {
                            create: product.promotions.map(promo => ({
                                promotionId: promo.promotionId,
                                promotionType: promo.promotionType,
                                startDate: new Date(promo.startDate),
                                endDate: new Date(promo.endDate),
                                offerText: promo.offerText,
                                attributes: promo.attributes,
                                promotionPrice: promo.promotionPrice
                            }))
                        },
                        lastUpdated: new Date()
                    }
                });
            }
            catch (error) {
                console.error('Error saving product to DB:', error);
                throw error;
            }
        }
    }
    async getProducts(update, page, pageSize, sale) {
        if (update) {
            const productsFromApi = await this.fetchProductsFromApi();
            await this.saveProductsToDb(productsFromApi);
        }
        const whereClause = { category: 'pecivo' };
        if (sale !== undefined) {
            const saleBoolean = String(sale).toLowerCase() === 'true';
            whereClause.hasPromotions = saleBoolean;
        }
        const [productsFromDb, totalProducts] = await this.prisma.$transaction([
            this.prisma.pecivo.findMany({
                where: whereClause,
                include: { promotions: true },
                orderBy: { lastUpdated: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize
            }),
            this.prisma.pecivo.count({
                where: whereClause
            })
        ]);
        const totalPages = Math.ceil(totalProducts / pageSize);
        const transformedProducts = productsFromDb.map(product => ({
            productId: product.productId,
            title: product.title,
            price: product.price,
            unitPrice: product.unitPrice,
            imageUrl: product.imageUrl,
            unitOfMeasure: product.unitOfMeasure,
            isForSale: product.isForSale,
            aisleName: product.aisleName,
            superDepartmentName: product.superDepartmentName,
            promotions: product.promotions.map(promo => ({
                promotionId: promo.promotionId,
                promotionType: promo.promotionType,
                startDate: promo.startDate.toISOString(),
                endDate: promo.endDate.toISOString(),
                offerText: promo.offerText,
                attributes: promo.attributes,
                promotionPrice: promo.promotionPrice
            })),
            hasPromotions: product.promotions.length > 0,
            lastUpdated: product.lastUpdated,
        }));
        return {
            totalPages,
            totalProducts,
            products: transformedProducts
        };
    }
    async updateProductsFromApi() {
        const productsFromApi = await this.fetchProductsFromApi();
        await this.saveProductsToDb(productsFromApi);
    }
    async getProductById(productId) {
        const productsFromDb = await this.prisma.pecivo.findMany({
            where: { productId },
            include: { promotions: true },
            orderBy: { lastUpdated: 'desc' }
        });
        return productsFromDb.map(product => ({
            productId: product.productId,
            title: product.title,
            price: product.price,
            unitPrice: product.unitPrice,
            imageUrl: product.imageUrl,
            unitOfMeasure: product.unitOfMeasure,
            isForSale: product.isForSale,
            aisleName: product.aisleName,
            superDepartmentName: product.superDepartmentName,
            promotions: product.promotions.map(promo => ({
                promotionId: promo.promotionId,
                promotionType: promo.promotionType,
                startDate: promo.startDate.toISOString(),
                endDate: promo.endDate.toISOString(),
                offerText: promo.offerText,
                attributes: promo.attributes,
                promotionPrice: promo.promotionPrice
            })),
            hasPromotions: product.promotions.length > 0,
            lastUpdated: product.lastUpdated
        }));
    }
    extractPromotionPrice(offerText) {
        const match = offerText.match(/S Clubcard ([0-9,.]+) €/);
        return match ? parseFloat(match[1].replace(',', '.')) : null;
    }
};
exports.PecivoService = PecivoService;
exports.PecivoService = PecivoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        prisma_service_1.PrismaService])
], PecivoService);
//# sourceMappingURL=pecivo.service.js.map