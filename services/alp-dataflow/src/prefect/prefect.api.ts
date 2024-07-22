import { AxiosRequestConfig } from 'axios'
import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom, map } from 'rxjs'
import { Agent } from 'https'
import { env, services } from '../env'
import { createLogger } from '../logger'
import { PrefectFlowDto } from '../prefect-flow/dto'
import { IFlowRunQueryDto, IPrefectFlowRunDto } from '../types'
import * as dayjs from 'dayjs'

interface FlowRunParams {
  name: string
  message: string
  deploymentName: string
  flowName: string
  parameters: object
  schedule?: string | null
}

@Injectable()
export class PrefectAPI {
  private readonly url: string
  private readonly httpsAgent: Agent
  private readonly logger = createLogger(this.constructor.name)

  constructor(private readonly httpService: HttpService) {
    if (services.prefect) {
      this.url = services.prefect
      this.httpsAgent = new Agent({
        rejectUnauthorized: true,
        ca: env.SSL_CA_CERT
      })
    } else {
      throw new Error('No url is set for PrefectAPI')
    }
  }

  async getDeploymentByFlowId(id: string) {
    const errorMessage = 'Error while getting prefect deployment by flow ID'
    try {
      const options = await this.createOptions()
      const url = `${this.url}/deployments/filter`
      const data = {
        flows: {
          id: {
            any_: [id]
          }
        }
      }
      const obs = this.httpService.post(url, data, options)
      const deployments = await firstValueFrom(obs.pipe(map(result => result.data)))
      return deployments[0]
    } catch (error) {
      this.logger.info(`Error occurred while getting deployment by flow ID: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async getDeployment(deploymentName: string, flowName: string) {
    const errorMessage = 'Error while getting prefect deployment'
    try {
      const options = await this.createOptions()
      const url = `${this.url}/deployments/name/${flowName}/${deploymentName}`
      const obs = this.httpService.get(url, options)
      const result = await firstValueFrom(obs.pipe(map(result => result.data)))
      return {
        deploymentId: result.id,
        infrastructureDocId: result.infrastructure_document_id
      }
    } catch (error) {
      this.logger.error(`Error occurred while getting prefect deployment: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async getAllFlowRuns(filter?: IFlowRunQueryDto) {
    const errorMessage = 'Error while getting all prefect flow runs'

    try {
      const options = await this.createOptions()

      const url = `${this.url}/flow_runs/filter`

      const data: Record<string, string | object> = {
        sort: 'START_TIME_DESC',
        ...this.getFilters(filter)
      }

      const obs = this.httpService.post(url, data, options)
      return await firstValueFrom(obs.pipe(map(result => result.data)))
    } catch (error) {
      this.logger.error(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async getFlowRunsByDeploymentNames(deploymentNames: string[], extraFilter?: IFlowRunQueryDto) {
    const errorMessage = 'Error while getting prefect flow runs by deployment names'
    try {
      const options = await this.createOptions()

      const url = `${this.url}/flow_runs/filter`

      const data: Record<string, string | object> = {
        sort: 'START_TIME_DESC',
        ...this.getFilters({ ...extraFilter, deploymentNames })
      }

      const obs = this.httpService.post(url, data, options)
      return await firstValueFrom(obs.pipe(map(result => result.data)))
    } catch (error) {
      this.logger.error(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async getFlowRunsByDataset(databaseCode: string, dataset: string, tags: string[] = []) {
    const errorMessage = 'Error while getting flow runs by dataset'
    try {
      const options = await this.createOptions()

      const url = `${this.url}/flow_runs/filter`

      const data = {
        sort: 'START_TIME_DESC',
        flow_runs: {
          operator: 'and_',
          name: { any_: [`${databaseCode}.${dataset}`] },
          tags: { operator: 'and_', all_: tags }
        }
      }
      const obs = this.httpService.post(url, data, options)
      return await firstValueFrom(obs.pipe<IPrefectFlowRunDto[]>(map(result => result.data)))
    } catch (error) {
      this.logger.info(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async getFlowRun(id: string) {
    const errorMessage = 'Error while getting prefect flow run by id'
    try {
      const options = await this.createOptions()

      const url = `${this.url}/flow_runs/filter`

      const data = {
        flow_runs: {
          id: {
            any_: [id]
          }
        }
      }
      const obs = this.httpService.post(url, data, options)
      const flowRuns = await firstValueFrom(obs.pipe(map(result => result.data)))
      return flowRuns[0]
    } catch (error) {
      this.logger.info(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async getTaskRunLogs(id: string) {
    const errorMessage = 'Error while getting prefect flow run logs by id'
    try {
      const options = await this.createOptions()

      const url = `${this.url}/logs/filter`

      const data = {
        offset: 0,
        logs: {
          level: { ge_: 0 },
          task_run_id: {
            any_: [id]
          }
        },
        sort: 'TIMESTAMP_ASC'
      }
      const obs = this.httpService.post(url, data, options)
      return await firstValueFrom(obs.pipe(map(result => result.data)))
    } catch (error) {
      this.logger.info(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async getTaskRunState(id: string) {
    const errorMessage = 'Error while getting prefect task run states by id'
    try {
      const options = await this.createOptions()
      const url = `${this.url}/task_runs/${id}`
      const obs = this.httpService.get(url, options)
      return await firstValueFrom(obs.pipe(map(result => result.data)))
    } catch (error) {
      this.logger.info(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async getTaskRuns(id: string) {
    const errorMessage = 'Error while getting prefect task runs by flow run id'
    try {
      const options = await this.createOptions()

      const url = `${this.url}/task_runs/filter`

      const data = {
        flow_runs: {
          id: {
            any_: [id]
          }
        },
        sort: 'EXPECTED_START_TIME_DESC'
      }
      const obs = this.httpService.post(url, data, options)
      const taskRuns = await firstValueFrom(obs.pipe(map(result => result.data)))
      return taskRuns
    } catch (error) {
      this.logger.info(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async getFlowRunLogs(id: string) {
    const errorMessage = 'Error while getting prefect flow run logs by id'
    try {
      const options = await this.createOptions()

      const url = `${this.url}/logs/filter`

      const data = {
        offset: 0,
        logs: {
          flow_run_id: {
            any_: [id]
          }
        },
        sort: 'TIMESTAMP_ASC'
      }
      const obs = this.httpService.post(url, data, options)
      return await firstValueFrom(obs.pipe(map(result => result.data)))
    } catch (error) {
      this.logger.info(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async createFlowRun(name, deploymentName, flowName, parameters, schedule = null) {
    this.logger.info(`Executing flow run ${name}...`)
    const message = `Flow run '${name}' has started from alp-dataflow`
    return this.executeFlowRun({ name, message, deploymentName, flowName, parameters, schedule })
  }

  async cancelFlowRun(id: string) {
    const errorMessage = `Error while cancelling flow run with id: ${id}`
    try {
      const options = await this.createOptions()
      const url = `${this.url}/flow_runs/${id}/set_state`
      const data = { state: { type: 'CANCELLED' } }
      const obs = this.httpService.post(url, data, options)
      return await firstValueFrom(obs.pipe(map(result => result.data)))
    } catch (error) {
      this.logger.info(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  private async executeFlowRun({
    name,
    message,
    deploymentName,
    flowName,
    parameters,
    schedule = null
  }: FlowRunParams) {
    const options = await this.createOptions()
    const { deploymentId, infrastructureDocId } = await this.getDeployment(deploymentName, flowName)
    const url = `${this.url}/deployments/${deploymentId}/create_flow_run`

    if (schedule && !dayjs(schedule).isValid()) {
      throw new BadRequestException(`Invalid schedule time`)
    }
    if (schedule && dayjs(schedule).isBefore(dayjs())) {
      throw new BadRequestException('Schedule time must be in the future')
    }
    const data = {
      state: {
        type: 'SCHEDULED',
        message,
        ...(schedule ? { state_details: { scheduled_time: schedule } } : {})
      },
      name,
      parameters,
      infrastructure_document_id: infrastructureDocId,
      empirical_policy: {
        retries: 0,
        retry_delay: 0,
        resuming: false
      }
    }
    const obs = this.httpService.post(url, data, options)
    const result = await firstValueFrom(obs.pipe(map(result => result.data)))
    return result.id
  }

  async getFlows() {
    const errorMessage = 'Error while getting prefect flows'
    try {
      const options = await this.createOptions()
      const url = `${this.url}/flows/filter`
      const data = { sort: 'CREATED_DESC' }
      const obs = this.httpService.post(url, data, options)
      return await firstValueFrom(obs.pipe(map(result => result.data)))
    } catch (error) {
      this.logger.info(`Error occurred while getting flows: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async createFlow(prefectFlowDto: PrefectFlowDto) {
    const name = prefectFlowDto.name
    try {
      const options = await this.createOptions()
      const url = `${this.url}/flows`
      const obs = this.httpService.post(url, prefectFlowDto, options)
      return await firstValueFrom(obs.pipe(map(result => result.data)))
    } catch (error) {
      const errorMessage = `Error while creating flow ${name}`
      this.logger.error(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async deleteFlow(id) {
    const errorMessage = `Error while deleting flow ${id}`
    try {
      const options = await this.createOptions()
      const url = `${this.url}/flows/${id}`
      const obs = this.httpService.delete(url, options)
      await firstValueFrom(obs.pipe(map(result => result.data)))
      return { id }
    } catch (error) {
      this.logger.info(`Error occurred while deleting flow: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async getFlowRunState(id) {
    const errorMessage = 'Error while getting prefect flow run states by id'
    try {
      const options = await this.createOptions()
      const url = `${this.url}/flow_runs/${id}`
      const obs = this.httpService.get(url, options)
      return await firstValueFrom(obs.pipe(map(result => result.data)))
    } catch (error) {
      this.logger.info(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async getRunsForFlowRun(id: string) {
    const errorMessage = `Error while getting prefect runs for flow run ${id}`
    try {
      const options = await this.createOptions()
      const url = `${this.url}/flow_runs/${id}/graph-v2`
      const obs = this.httpService.get(url, options)
      return await firstValueFrom(obs.pipe(map(result => result.data)))
    } catch (error) {
      this.logger.info(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async getFlowRunsArtifacts(id: string) {
    const errorMessage = `Error while getting prefect flow run artifacts by id: ${id}`
    try {
      const options = await this.createOptions()
      const url = `${this.url}/artifacts/filter`
      const data: Record<string, string | object | number> = {
        artifacts: {
          flow_run_id: {
            any_: [id]
          }
        }
      }
      const obs = this.httpService.post(url, data, options)
      const result = await firstValueFrom(obs.pipe(map(result => result.data)))
      return result.filter(item => item.task_run_id !== null) // only keep the task run with non-null taskRunId
    } catch (error) {
      this.logger.info(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  private getFilters(filter?: IFlowRunQueryDto) {
    if (filter == null) {
      return {}
    }

    const flowRuns: Record<string, string | object> = {}

    if (filter.startDate || filter.endDate) {
      flowRuns['expected_start_time'] = {
        after_: filter.startDate,
        before_: filter.endDate
      }
    }

    if (filter.states) {
      flowRuns['state'] = {
        name: {
          any_: filter.states
        }
      }
    }

    if (filter.tags) {
      flowRuns['tags'] = {
        all_: filter.tags
      }
    }

    const flows: Record<string, string | object> = {}

    if (filter.flowIds) {
      flows['id'] = {
        any_: filter.flowIds
      }
    }

    const deployments: Record<string, string | object> = {}

    if (filter.deploymentIds) {
      deployments['id'] = {
        any_: filter.deploymentIds
      }
    }

    if (filter.deploymentNames) {
      deployments['name'] = {
        any_: filter.deploymentNames
      }
    }

    const workPools: Record<string, string | object> = {}

    if (filter.workPools) {
      workPools['name'] = {
        any_: filter.workPools
      }
    }

    return {
      flows,
      flow_runs: flowRuns,
      deployments,
      work_pools: workPools
    }
  }

  private async createOptions(): Promise<AxiosRequestConfig> {
    return {
      httpsAgent: this.httpsAgent
    }
  }
}
