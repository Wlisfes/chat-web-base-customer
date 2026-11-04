import { Controller, Get, Header, Req } from '@nestjs/common'
import { Request } from 'express'
import { createRouteServer } from '@web-client-ssr-server/vite.server'

@Controller()
export class AppController {
    @Get(['/', '*'])
    @Header('Content-Type', 'text/html; charset=utf-8')
    fetchBaseRender(@Req() request: Request) {
        return createRouteServer(request)
    }
}