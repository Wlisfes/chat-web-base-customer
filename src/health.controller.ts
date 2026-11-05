import { Controller, Get, Header } from '@nestjs/common'

@Controller()
export class HealthController {
    @Get('health')
    @Header('Content-Type', 'text/plain; charset=utf-8')
    fetchHealth() {
        return 'healthy\n'
    }
}
