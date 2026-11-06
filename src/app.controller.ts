import { Controller, Get, NotFoundException, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { createRouteServer } from './vite.server'

const STATIC_ASSET = /\.[a-zA-Z0-9]+$/

@Controller()
export class AppController {
    @Get(['/', '*'])
    async fetchBaseRender(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const path = request.path.split('?')[0]
        if (path !== '/' && STATIC_ASSET.test(path)) {
            throw new NotFoundException()
        }
        response.type('html')
        return createRouteServer(request)
    }
}
