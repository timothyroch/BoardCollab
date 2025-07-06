import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { DataSource, In } from "typeorm";

// Extend Express Request interface to include user and tenantId
declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            tenantId?: string;
            [key: string]: any;
        };
    }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(private dataSource: DataSource) {}
    async use(req: Request, res: Response, next: NextFunction) {
        if (req.user && req.user.tenantId) {
            const tenantId = req.user.tenantId;

            try {
                await this.dataSource.query(`SET app.current_tenant = '${tenantId}'`);
            } catch (error) {
                console.error('Error setting tenant context:', error);
        }
        }
        next();
    }
}