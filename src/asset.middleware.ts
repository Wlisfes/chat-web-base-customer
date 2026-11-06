import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import express from 'express'
import { resolve } from 'path'
import compression from 'compression'
import { createViteServer } from './vite.server'

const compress = compression()

@Injectable()
export class AssetMiddleware implements NestMiddleware {
    private readonly serve = express.static(resolve(process.cwd(), 'build/client'), { index: false })

    use(request: Request, response: Response, next: NextFunction) {
        if (process.env.NODE_ENV === 'production') {
            return compress(request as any, response as any, () => this.serve(request, response, next))
        }
        return createViteServer()
            .then(vite => vite.middlewares(request, response, next))
            .catch(next)
    }
}