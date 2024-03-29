import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus'

@Controller()
export class HealthController {
  constructor(private healthCheckService: HealthCheckService, private typeOrmHealthIndicator: TypeOrmHealthIndicator) {}

  @Get('/check-liveness')
  @HealthCheck()
  checkLiveness() {
    return this.checkHealth('Liveness')
  }

  @Get('/check-readiness')
  @HealthCheck()
  checkReadiness() {
    return this.checkHealth('Readiness')
  }

  private checkHealth(type: 'Liveness' | 'Readiness') {
    const healthIndicators = []
    if (type === 'Readiness') {
      healthIndicators.push(() => this.typeOrmHealthIndicator.pingCheck('database'))
    }

    return this.healthCheckService.check(healthIndicators)
  }
}
