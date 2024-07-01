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
exports.TescoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let TescoService = class TescoService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getPrismaModel(category) {
        const modelMapping = {
            trvanlivePotraviny: this.prisma.trvanlivePotraviny,
            specialnaAZdravaVyziva: this.prisma.specialnaAZdravaVyziva,
            pecivo: this.prisma.pecivo,
            ovocieAZeleniny: this.prisma.ovocieAZeleniny,
            napoje: this.prisma.napoje,
            mrazenePotraviny: this.prisma.mrazenePotraviny,
            mliecneVyrobkyAVajcia: this.prisma.mliecneVyrobkyAVajcia,
            masoRybyALahodky: this.prisma.masoRybyALahodky,
            grilovanie: this.prisma.grilovanie,
            alkohol: this.prisma.alkohol,
        };
        const model = modelMapping[category];
        if (!model) {
            throw new common_1.NotFoundException(`Model for category ${category} not found`);
        }
        return model;
    }
    createWhereClause(sale) {
        const where = {};
        if (sale !== undefined) {
            where['hasPromotions'] = sale;
        }
        return where;
    }
    async getProducts(category, page, pageSize, sale) {
        const skip = (page - 1) * pageSize;
        const take = Number(pageSize);
        const allCategories = [
            'trvanlivePotraviny',
            'specialnaAZdravaVyziva',
            'pecivo',
            'ovocieAZeleniny',
            'napoje',
            'mrazenePotraviny',
            'mliecneVyrobkyAVajcia',
            'masoRybyALahodky',
            'grilovanie',
            'alkohol',
        ];
        const availableCategories = new Set(allCategories);
        if (category === 'all') {
            const models = [
                { model: 'trvanlivePotraviny', category: 'trvanlivePotraviny' },
                { model: 'specialnaAZdravaVyziva', category: 'specialnaAZdravaVyziva' },
                { model: 'pecivo', category: 'pecivo' },
                { model: 'ovocieAZeleniny', category: 'ovocieAZeleniny' },
                { model: 'napoje', category: 'napoje' },
                { model: 'mrazenePotraviny', category: 'mrazenePotraviny' },
                { model: 'mliecneVyrobkyAVajcia', category: 'mliecneVyrobkyAVajcia' },
                { model: 'masoRybyALahodky', category: 'masoRybyALahodky' },
                { model: 'grilovanie', category: 'grilovanie' },
                { model: 'alkohol', category: 'alkohol' },
            ];
            const allResults = [];
            let totalProducts = 0;
            for (const { model, category } of models) {
                const where = this.createWhereClause(sale);
                const modelInstance = this.prisma[model];
                const distinctProductIds = await modelInstance.findMany({
                    where,
                    select: { productId: true },
                    distinct: ['productId']
                });
                totalProducts += distinctProductIds.length;
                const latestProducts = await modelInstance.findMany({
                    where,
                    include: { promotions: true },
                    orderBy: { lastUpdated: 'desc' },
                    distinct: ['productId'],
                });
                const transformedProducts = latestProducts.map((product) => ({
                    ...product,
                    category
                }));
                allResults.push(...transformedProducts);
            }
            const totalPages = Math.ceil(totalProducts / pageSize);
            const paginatedProducts = allResults.slice(skip, skip + take);
            const transformedProducts = paginatedProducts.map((product) => ({
                dbId: product.id,
                productId: product.productId,
                title: product.title,
                price: product.price,
                unitPrice: product.unitPrice,
                imageUrl: product.imageUrl,
                unitOfMeasure: product.unitOfMeasure,
                isForSale: product.isForSale,
                aisleName: product.aisleName,
                superDepartmentName: product.superDepartmentName,
                category: product.category,
                promotions: product.promotions.map((promo) => ({
                    promotionId: promo.promotionId,
                    promotionType: promo.promotionType,
                    startDate: promo.startDate.toISOString(),
                    endDate: promo.endDate.toISOString(),
                    offerText: promo.offerText,
                    attributes: promo.attributes,
                    promotionPrice: promo.promotionPrice,
                })),
                hasPromotions: product.promotions.length > 0,
                lastUpdated: product.lastUpdated,
            }));
            return {
                totalPages,
                totalProducts,
                products: transformedProducts,
                availableCategories: Array.from(availableCategories),
            };
        }
        else {
            const model = this.getPrismaModel(category);
            const where = this.createWhereClause(sale);
            const distinctProductIds = await model.findMany({
                where,
                select: { productId: true },
                distinct: ['productId']
            });
            const totalProducts = distinctProductIds.length;
            const totalPages = Math.ceil(totalProducts / pageSize);
            const latestProducts = await model.findMany({
                where,
                skip,
                take,
                include: { promotions: true },
                orderBy: { lastUpdated: 'desc' },
                distinct: ['productId'],
            });
            const transformedProducts = latestProducts.map((product) => ({
                dbId: product.id,
                productId: product.productId,
                title: product.title,
                price: product.price,
                unitPrice: product.unitPrice,
                imageUrl: product.imageUrl,
                unitOfMeasure: product.unitOfMeasure,
                isForSale: product.isForSale,
                aisleName: product.aisleName,
                superDepartmentName: product.superDepartmentName,
                category,
                promotions: product.promotions.map((promo) => ({
                    promotionId: promo.promotionId,
                    promotionType: promo.promotionType,
                    startDate: promo.startDate.toISOString(),
                    endDate: promo.endDate.toISOString(),
                    offerText: promo.offerText,
                    attributes: promo.attributes,
                    promotionPrice: promo.promotionPrice,
                })),
                hasPromotions: product.promotions.length > 0,
                lastUpdated: product.lastUpdated,
            }));
            return {
                totalPages,
                totalProducts,
                products: transformedProducts,
                availableCategories: Array.from(availableCategories),
            };
        }
    }
    async getProductById(category, productId) {
        const model = this.getPrismaModel(category);
        const productsFromDb = await model.findMany({
            where: { productId },
            include: { promotions: true },
            orderBy: { lastUpdated: 'desc' }
        });
        return productsFromDb.map(product => ({
            dbId: product.id,
            productId: product.productId,
            title: product.title,
            price: product.price,
            unitPrice: product.unitPrice,
            imageUrl: product.imageUrl,
            unitOfMeasure: product.unitOfMeasure,
            isForSale: product.isForSale,
            aisleName: product.aisleName,
            superDepartmentName: product.superDepartmentName,
            category,
            promotions: product.promotions.map(promo => ({
                promotionId: promo.promotionId,
                promotionType: promo.promotionType,
                startDate: promo.startDate.toISOString(),
                endDate: promo.endDate.toISOString(),
                offerText: promo.offerText,
                attributes: promo.attributes,
                promotionPrice: promo.promotionPrice,
            })),
            hasPromotions: product.promotions.length > 0,
            lastUpdated: product.lastUpdated,
        }));
    }
    async searchModelForTerm(model, searchTerm, sale, category) {
        const where = {
            title: {
                contains: searchTerm,
                mode: 'insensitive',
            },
        };
        if (sale !== undefined) {
            where['hasPromotions'] = sale;
        }
        const results = await model.findMany({
            where,
            include: { promotions: true },
            orderBy: { lastUpdated: 'desc' }
        });
        return results.map((product) => ({
            ...product,
            category
        }));
    }
    async searchProductsByName(searchTerm, page, pageSize, sale, category) {
        const allCategories = [
            'trvanlivePotraviny',
            'specialnaAZdravaVyziva',
            'pecivo',
            'ovocieAZeleniny',
            'napoje',
            'mrazenePotraviny',
            'mliecneVyrobkyAVajcia',
            'masoRybyALahodky',
            'grilovanie',
            'alkohol',
        ];
        const availableCategories = new Set(allCategories);
        let models;
        if (category) {
            models = [{ model: this.getPrismaModel(category), category }];
        }
        else {
            models = [
                { model: this.prisma.trvanlivePotraviny, category: 'trvanlivePotraviny' },
                { model: this.prisma.specialnaAZdravaVyziva, category: 'specialnaAZdravaVyziva' },
                { model: this.prisma.pecivo, category: 'pecivo' },
                { model: this.prisma.ovocieAZeleniny, category: 'ovocieAZeleniny' },
                { model: this.prisma.napoje, category: 'napoje' },
                { model: this.prisma.mrazenePotraviny, category: 'mrazenePotraviny' },
                { model: this.prisma.mliecneVyrobkyAVajcia, category: 'mliecneVyrobkyAVajcia' },
                { model: this.prisma.masoRybyALahodky, category: 'masoRybyALahodky' },
                { model: this.prisma.grilovanie, category: 'grilovanie' },
                { model: this.prisma.alkohol, category: 'alkohol' },
            ];
        }
        const searchPromises = models.map(({ model, category }) => this.searchModelForTerm(model, searchTerm, sale, category));
        const searchResults = await Promise.all(searchPromises);
        const productsFromDb = searchResults.flat();
        const totalProducts = productsFromDb.length;
        const totalPages = Math.ceil(totalProducts / pageSize);
        const skip = (page - 1) * pageSize;
        const paginatedProducts = productsFromDb.slice(skip, skip + pageSize);
        const transformedProducts = paginatedProducts.map((product) => ({
            dbId: product.id,
            productId: product.productId,
            title: product.title,
            price: product.price,
            unitPrice: product.unitPrice,
            imageUrl: product.imageUrl,
            unitOfMeasure: product.unitOfMeasure,
            isForSale: product.isForSale,
            aisleName: product.aisleName,
            superDepartmentName: product.superDepartmentName,
            category: product.category,
            promotions: product.promotions.map((promo) => ({
                promotionId: promo.promotionId,
                promotionType: promo.promotionType,
                startDate: promo.startDate.toISOString(),
                endDate: promo.endDate.toISOString(),
                offerText: promo.offerText,
                attributes: promo.attributes,
                promotionPrice: promo.promotionPrice,
            })),
            hasPromotions: product.promotions.length > 0,
            lastUpdated: product.lastUpdated,
        }));
        return {
            totalPages,
            totalProducts,
            products: transformedProducts,
            availableCategories: Array.from(availableCategories),
        };
    }
};
exports.TescoService = TescoService;
exports.TescoService = TescoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TescoService);
//# sourceMappingURL=tesco.service.js.map