import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { join } from 'path'
import { mkdirSync, readFileSync, rmdirSync, writeFileSync } from 'fs'
import { PrefectAPI } from './prefect.api'
import { DataflowService } from '../dataflow/dataflow.service'
import { AnalysisflowService } from '../analysis-flow/analysis-flow.service'
import { PrefectParamsTransformer } from './prefect-params.transformer'
import { PrefectAnalysisParamsTransformer } from './prefect-analysis-params.transformer'
import {
  IPrefectAdhocFlowDto,
  IPrefectFlowRunByDeploymentDto,
  ITestDataflowDto,
  IPrefectFlowRunByMetadataDto,
  IPluginUploadStatusDetail,
  IPluginUploadStatusDto
} from '../types'
import { PrefectExecutionClient } from './prefect-execution.client'
import { env } from '../env'
import { createLogger } from '../logger'
import {
  FLOW_METADATA,
  FLOW_METADATA_FOLDER_PATH,
  FLOW_METADATA_JSON_FILENAME,
  PREFECT_ADHOC_FLOW_FOLDER_PATH,
  PluginUploadStatus,
  PluginUploadStatusText,
  PrefectDeploymentPythonFiles
} from '../common/const'
import { PrefectFlowService } from '../prefect-flow/prefect-flow.service'
import { DataQualityService } from '../data-quality/data-quality.service'
import { DataQualityFlowRunDto } from '../data-quality/dto'
import { DataCharacterizationService } from '../data-characterization/data-characterization.service'
import { DataCharacterizationFlowRunDto } from 'src/data-characterization/dto'
import { REQUEST } from '@nestjs/core'

@Injectable()
export class PrefectService {
  private readonly logger = createLogger(this.constructor.name)
  private readonly jwt: string

  constructor(
    @Inject(REQUEST) request: Request,
    private readonly dataflowService: DataflowService,
    private readonly analysisflowService: AnalysisflowService,
    private readonly prefectApi: PrefectAPI,
    private readonly prefectParamsTransformer: PrefectParamsTransformer,
    private readonly prefectAnalysisParamsTransformer: PrefectAnalysisParamsTransformer,
    private readonly prefectExecutionClient: PrefectExecutionClient,
    private readonly prefectFlowService: PrefectFlowService,
    private readonly dataQualityService: DataQualityService,
    private readonly dataCharacterizationService: DataCharacterizationService
  ) {
    this.jwt = request.headers['authorization']
  }

  async getFlowRun(id: string) {
    const flowRun = await this.prefectApi.getFlowRun(id)
    // Redact sensitive input parameters for all flow runs
    flowRun.parameters = this.redactSensitivePrefectParameters(flowRun.parameters)
    return flowRun
  }

  async getFlowRunLogs(id: string) {
    return this.prefectApi.getFlowRunLogs(id)
  }

  async getTaskRuns(id: string) {
    return this.prefectApi.getTaskRuns(id)
  }

  async getTaskRunLogs(id: string) {
    return this.prefectApi.getTaskRunLogs(id)
  }

  async getTaskRunState(id: string) {
    return this.prefectApi.getTaskRunState(id)
  }

  async createDataflowUIFlowRun(id: string) {
    const revision = await this.dataflowService.getLastDataflowRevision(id)
    const prefectParams = this.prefectParamsTransformer.transform(revision.flow)

    const flowRunId = await this.createFlowRunByMetadata({
      type: FLOW_METADATA.dataflow_ui,
      flowRunName: revision.name,
      options: prefectParams
    })
    await this.dataflowService.createDataflowRun(id, flowRunId)
    return flowRunId
  }

  // create analysis-flow-run
  async createAnalysisFlowRun(id: string) {
    const revision = await this.analysisflowService.getLastAnalysisflowRevision(id)
    const prefectParams = this.prefectAnalysisParamsTransformer.transform(revision.flow)

    const prefectDeploymentName = env.PREFECT_DEPLOYMENT_NAME
    const prefectFlowName = env.PREFECT_FLOW_NAME

    const flowRunId = await this.prefectApi.createFlowRun(
      revision.name,
      prefectDeploymentName,
      prefectFlowName,
      prefectParams
    )
    await this.analysisflowService.createAnalysisflowRun(id, flowRunId)
    return flowRunId
  }

  async createFlowRunByDeployment(flowRun: IPrefectFlowRunByDeploymentDto) {
    const { flowRunName, flowName, deploymentName, params, schedule } = flowRun
    const flowRunId = await this.prefectApi.createFlowRun(flowRunName, deploymentName, flowName, params, schedule)

    return flowRunId
  }

  async createTestRun(testFlow: ITestDataflowDto) {
    const prefectParams = this.prefectParamsTransformer.transform(testFlow.dataflow, true)
    return await this.createFlowRunByMetadata({
      type: FLOW_METADATA.dataflow_ui,
      flowRunName: 'Test-run',
      options: prefectParams
    })
  }

  async getFlowMetadata() {
    return this.prefectFlowService.getFlowMetadata()
  }

  async getDataModels() {
    return this.prefectFlowService.getDataModels()
  }

  async getDefaultPluginById(pluginId: string) {
    return this.prefectFlowService.getDefaultPluginById(pluginId)
  }

  async getDefaultPlugins() {
    return this.prefectFlowService.getDefaultPlugins()
  }

  async getDefaultPluginsStatus() {
    const plugins = await this.prefectFlowService.getDefaultPlugins()
    const statusDetails: IPluginUploadStatusDetail[] = []
    let noActiveInstallations = true
    let installationStatus: string
    for (const plugin of plugins) {
      if (plugin.status === PluginUploadStatus.INSTALLING) {
        noActiveInstallations = false
      }
      statusDetails.push({
        pluginId: plugin.pluginId,
        name: plugin.name,
        status: plugin.status,
        createdAt: plugin.createdDate.toString(),
        modifiedAt: plugin.modifiedDate.toString(),
        type: plugin.type
      })
    }
    if (statusDetails.every(s => s.status === PluginUploadStatus.PENDING)) {
      installationStatus = PluginUploadStatusText.PENDING
    }
    if (statusDetails.some(s => s.status === PluginUploadStatus.FAILED) && noActiveInstallations) {
      installationStatus = PluginUploadStatusText.FAILED
    }
    if (statusDetails.every(s => s.status === PluginUploadStatus.COMPLETE)) {
      installationStatus = PluginUploadStatusText.COMPLETE
    }
    if (statusDetails.some(s => s.status === PluginUploadStatus.INSTALLING)) {
      installationStatus = PluginUploadStatusText.INSTALLING
    }
    const result: IPluginUploadStatusDto = { statusDetails, noActiveInstallations, installationStatus }
    return result
  }

  // TODO: confirm if we want to deprecate and replace with polling
  async createFlowFileDeployment(userId: string, file: Express.Multer.File, adhocFlowDto: IPrefectAdhocFlowDto) {
    const { url, defaultPluginId } = adhocFlowDto
    if (!file && !url && !defaultPluginId) {
      const errorMessage = `pip file not uploaded or git url not provided or plugin id not provided`
      this.logger.error(`${errorMessage}`)
      throw new InternalServerErrorException(errorMessage)
    }

    let defaultDeploymentInfo
    if (defaultPluginId) {
      defaultDeploymentInfo = await this.prefectFlowService.getDefaultPluginById(defaultPluginId)
      if (!defaultDeploymentInfo) {
        const errorMessage = `default plugin with id ${defaultPluginId} not found`
        this.logger.error(`${errorMessage}`)
        throw new InternalServerErrorException(errorMessage)
      }
      await this.prefectFlowService.updateDefaultPluginStatus(defaultPluginId, PluginUploadStatus.PENDING)
    }

    const { deploymentFolderPath, fileStem, modifiedFileStem, fileType } = file
      ? await this.processPipPackage(userId, { fileName: file.originalname })
      : url
      ? await this.processPipPackage(userId, { url: url })
      : await this.processPipPackage(userId, { url: defaultDeploymentInfo.url })
    this.logger.info(`Deployment Folder: ${deploymentFolderPath}`)

    let flowMetadataInput
    let existingFlowMetadata
    try {
      if (defaultPluginId) {
        await this.prefectFlowService.updateDefaultPluginStatus(defaultPluginId, PluginUploadStatus.INSTALLING)
      }
      // create python virtual environment with exisiting dependencies
      const dependencyScriptPath = join(deploymentFolderPath, PrefectDeploymentPythonFiles['SCRIPT'])
      writeFileSync(dependencyScriptPath, this.prefectExecutionClient.createInstallDependenciesScript())
      await this.prefectExecutionClient.executeCreateVirtualEnvironment(userId, modifiedFileStem)

      // install pip package
      const pipInstallPath = join(deploymentFolderPath, PrefectDeploymentPythonFiles['PIP_INSTALL'])
      if (url) {
        writeFileSync(pipInstallPath, this.prefectExecutionClient.createPipInstallScript(fileStem, fileType, url))
      } else if (defaultDeploymentInfo && defaultDeploymentInfo.url) {
        writeFileSync(
          pipInstallPath,
          this.prefectExecutionClient.createPipInstallScript(fileStem, fileType, defaultDeploymentInfo.url)
        )
      } else {
        writeFileSync(pipInstallPath, this.prefectExecutionClient.createPipInstallScript(fileStem, fileType))
      }

      await this.prefectExecutionClient.executePipInstall(userId, modifiedFileStem)

      if (defaultDeploymentInfo && defaultDeploymentInfo.url) {
        flowMetadataInput = await this.prepareFlowMetadata(deploymentFolderPath, defaultDeploymentInfo.url)
      } else {
        flowMetadataInput = await this.prepareFlowMetadata(deploymentFolderPath, url)
      }

      await this.prefectFlowService.createFlowMetadata(flowMetadataInput)
    } catch (err) {
      if (flowMetadataInput) {
        existingFlowMetadata = await this.prefectFlowService.getFlowMetadataById(flowMetadataInput.flowId)
        if (!existingFlowMetadata) {
          await this.prefectFlowService.deleteFlowMetadata(flowMetadataInput.flowId)
          await this.prefectApi.deleteFlow(flowMetadataInput.flowId)
        }
      }
      this.deleteDeploymentFolder(deploymentFolderPath)
      const errorMessage = `Error installing pip package, check if package is valid`
      this.logger.error(`${errorMessage}: ${err}`)
      if (defaultPluginId) {
        await this.prefectFlowService.updateDefaultPluginStatus(defaultPluginId, PluginUploadStatus.FAILED)
      }
      throw new InternalServerErrorException(errorMessage)
    }

    try {
      const deploymentPath = join(deploymentFolderPath, PrefectDeploymentPythonFiles['DEPLOYMENT'])
      writeFileSync(
        deploymentPath,
        this.prefectExecutionClient.createDeploymentTemplate(
          userId,
          flowMetadataInput.name,
          flowMetadataInput.entrypoint.replace(/\//g, '.').replace(/\.py$/, ''),
          flowMetadataInput.others.tags || []
        )
      )
      await this.prefectExecutionClient.executePythonPrefectModule(userId, modifiedFileStem)
      if (defaultPluginId) {
        await this.prefectFlowService.updateDefaultPluginStatus(defaultPluginId, PluginUploadStatus.COMPLETE)
      }
    } catch (err) {
      existingFlowMetadata = await this.prefectFlowService.getFlowMetadataById(flowMetadataInput.flowId)
      if (!existingFlowMetadata) {
        await this.prefectFlowService.deleteFlowMetadata(flowMetadataInput.flowId)
        await this.prefectApi.deleteFlow(flowMetadataInput.flowId)
      }
      const errorMessage = `Error creating flow with file ${fileStem}${fileType}`
      this.logger.error(`${errorMessage}: ${err}`)
      if (defaultPluginId) {
        await this.prefectFlowService.updateDefaultPluginStatus(defaultPluginId, PluginUploadStatus.FAILED)
      }
      throw new InternalServerErrorException(errorMessage)
    } finally {
      this.deleteDeploymentFolder(deploymentFolderPath)
    }
  }

  async triggerDefaultDeploymentsRun(userId: string) {
    const plugins = await this.prefectFlowService.getDefaultPlugins()
    for (const plugin of plugins) {
      await this.triggerDeploymentRun(userId, null, { defaultPluginId: plugin.pluginId })
    }
  }
  async triggerDeploymentRun(userId: string, file: Express.Multer.File, adhocFlowDto: IPrefectAdhocFlowDto) {
    const { url, defaultPluginId } = adhocFlowDto
    if (!file && !url && !defaultPluginId) {
      const errorMessage = `pip file not uploaded or git url not provided or plugin id is not provided`
      this.logger.error(`${errorMessage}`)
      throw new InternalServerErrorException(errorMessage)
    }

    let defaultDeploymentInfo
    if (defaultPluginId) {
      defaultDeploymentInfo = await this.prefectFlowService.getDefaultPluginById(defaultPluginId)
      if (!defaultDeploymentInfo) {
        const errorMessage = `default plugin with id ${defaultPluginId} not found`
        this.logger.error(`${errorMessage}`)
        throw new InternalServerErrorException(errorMessage)
      }
      await this.prefectFlowService.updateDefaultPluginStatus(defaultPluginId, PluginUploadStatus.PENDING)
    }

    const { deploymentFolderPath } = file
      ? await this.processPipPackage(userId, { fileName: file.originalname })
      : url
      ? await this.processPipPackage(userId, { url: url })
      : await this.processPipPackage(userId, { url: defaultDeploymentInfo.url })
    this.logger.info(`Deployment Folder: ${deploymentFolderPath}`)

    // start upload asychronously
    this.startUpload(userId, file, url, defaultDeploymentInfo, defaultPluginId)

    this.logger.info(`Plugin ${defaultPluginId} upload triggered successfully`)
    return defaultPluginId
  }

  private async startUpload(
    userId: string,
    file: Express.Multer.File,
    url: string,
    defaultDeploymentInfo,
    defaultPluginId: string
  ) {
    const { deploymentFolderPath, fileStem, modifiedFileStem, fileType } = file
      ? await this.processPipPackage(userId, { fileName: file.originalname })
      : url
      ? await this.processPipPackage(userId, { url: url })
      : await this.processPipPackage(userId, { url: defaultDeploymentInfo.url })
    this.logger.info(`Deployment Folder: ${deploymentFolderPath}`)

    let flowMetadataInput
    let existingFlowMetadata
    try {
      defaultDeploymentInfo.defaultPluginId
      if (defaultPluginId) {
        await this.prefectFlowService.updateDefaultPluginStatus(defaultPluginId, PluginUploadStatus.INSTALLING)
      }
      // create python virtual environment with exisiting dependencies
      const dependencyScriptPath = join(deploymentFolderPath, PrefectDeploymentPythonFiles['SCRIPT'])
      writeFileSync(dependencyScriptPath, this.prefectExecutionClient.createInstallDependenciesScript())
      await this.prefectExecutionClient.executeCreateVirtualEnvironment(userId, modifiedFileStem)

      // install pip package
      const pipInstallPath = join(deploymentFolderPath, PrefectDeploymentPythonFiles['PIP_INSTALL'])
      if (url) {
        writeFileSync(pipInstallPath, this.prefectExecutionClient.createPipInstallScript(fileStem, fileType, url))
      } else if (defaultDeploymentInfo && defaultDeploymentInfo.url) {
        writeFileSync(
          pipInstallPath,
          this.prefectExecutionClient.createPipInstallScript(fileStem, fileType, defaultDeploymentInfo.url)
        )
      } else {
        writeFileSync(pipInstallPath, this.prefectExecutionClient.createPipInstallScript(fileStem, fileType))
      }

      await this.prefectExecutionClient.executePipInstall(userId, modifiedFileStem)

      if (defaultDeploymentInfo && defaultDeploymentInfo.url) {
        flowMetadataInput = await this.prepareFlowMetadata(deploymentFolderPath, defaultDeploymentInfo.url)
      } else {
        flowMetadataInput = await this.prepareFlowMetadata(deploymentFolderPath, url)
      }

      await this.prefectFlowService.createFlowMetadata(flowMetadataInput)
    } catch (err) {
      if (flowMetadataInput) {
        existingFlowMetadata = await this.prefectFlowService.getFlowMetadataById(flowMetadataInput.flowId)
        if (!existingFlowMetadata) {
          await this.prefectFlowService.deleteFlowMetadata(flowMetadataInput.flowId)
          await this.prefectApi.deleteFlow(flowMetadataInput.flowId)
        }
      }
      this.deleteDeploymentFolder(deploymentFolderPath)
      const errorMessage = `Error installing pip package, check if package is valid`
      this.logger.error(`${errorMessage}: ${err}`)
      if (defaultPluginId) {
        await this.prefectFlowService.updateDefaultPluginStatus(defaultPluginId, PluginUploadStatus.FAILED)
      }
    }

    try {
      const deploymentPath = join(deploymentFolderPath, PrefectDeploymentPythonFiles['DEPLOYMENT'])
      writeFileSync(
        deploymentPath,
        this.prefectExecutionClient.createDeploymentTemplate(
          userId,
          flowMetadataInput.name,
          flowMetadataInput.entrypoint.replace(/\//g, '.').replace(/\.py$/, ''),
          flowMetadataInput.others.tags || []
        )
      )
      await this.prefectExecutionClient.executePythonPrefectModule(userId, modifiedFileStem)
      if (defaultPluginId) {
        await this.prefectFlowService.updateDefaultPluginStatus(defaultPluginId, PluginUploadStatus.COMPLETE)
      }
    } catch (err) {
      existingFlowMetadata = await this.prefectFlowService.getFlowMetadataById(flowMetadataInput.flowId)
      if (!existingFlowMetadata) {
        await this.prefectFlowService.deleteFlowMetadata(flowMetadataInput.flowId)
        await this.prefectApi.deleteFlow(flowMetadataInput.flowId)
      }
      const errorMessage = `Error creating flow with file ${fileStem}${fileType}`
      this.logger.error(`${errorMessage}: ${err}`)
      if (defaultPluginId) {
        await this.prefectFlowService.updateDefaultPluginStatus(defaultPluginId, PluginUploadStatus.FAILED)
      }
    } finally {
      this.deleteDeploymentFolder(deploymentFolderPath)
    }
  }

  async validateMetadataJson(deploymentFolderPath: string) {
    try {
      const metadata = JSON.parse(
        readFileSync(`${deploymentFolderPath}/${FLOW_METADATA_FOLDER_PATH}/${FLOW_METADATA_JSON_FILENAME}`, 'utf8')
      )

      if (!metadata[FLOW_METADATA.name]) {
        throw new BadRequestException('Missing name!')
      }
      if (!metadata[FLOW_METADATA.entrypoint]) {
        throw new BadRequestException('Missing entrypoint metadata!')
      }
      if (!metadata[FLOW_METADATA.type]) {
        throw new BadRequestException('Missing type metadata!')
      }
      if (metadata[FLOW_METADATA.type] === FLOW_METADATA.datamodels && !metadata[FLOW_METADATA.datamodels]) {
        throw new BadRequestException('Missing datamodels metadata!')
      }

      return metadata
    } catch (error) {
      const errorMessage = `Metadata file not found / has missing fields!`
      this.logger.error(`${errorMessage}: ${error}`)
      this.deleteDeploymentFolder(deploymentFolderPath)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  async prepareFlowMetadata(deploymentFolderPath: string, url: string) {
    const metadata = await this.validateMetadataJson(deploymentFolderPath)
    const { type, entrypoint, name, datamodels = {}, ...rest } = metadata
    const formattedName = name.replace(/_/g, '-')
    const newPrefectFlow = await this.prefectApi.createFlow({ name: formattedName })
    const flowMetadata = {
      flowId: newPrefectFlow.id,
      name: formattedName,
      type: type,
      entrypoint: entrypoint,
      url: url ? url : null,
      datamodels: type === FLOW_METADATA.datamodel && datamodels ? datamodels : null,
      others: rest ? rest : null
    }
    return flowMetadata
  }

  async cancelFlowRun(id: string) {
    return this.prefectApi.cancelFlowRun(id)
  }

  async getFlowRunState(id: string) {
    const flowRunState = await this.prefectApi.getFlowRunState(id)
    return flowRunState
  }

  async getRunsForFlowRun(id: string) {
    const runs = await this.prefectApi.getRunsForFlowRun(id)
    return runs
  }

  async createFlowRunByMetadata(metadata: IPrefectFlowRunByMetadataDto) {
    let currentFlow
    const flowMetadata = await this.prefectFlowService.getFlowMetadataByType(metadata.type)

    if (flowMetadata.length === 0) {
      throw new BadRequestException(`Flow does not exist for ${metadata.type}!`)
    }
    if (metadata.type === FLOW_METADATA.datamodel) {
      if (!metadata?.flowId && flowMetadata.length === 1) {
        currentFlow = flowMetadata[0]
      } else {
        const flow = flowMetadata.find(flow => flow.flowId === metadata?.flowId)
        currentFlow = flow
      }
    } else {
      currentFlow = flowMetadata[0]
    }

    const deployment = await this.prefectApi.getDeploymentByFlowId(currentFlow.flowId)
    if (!deployment) {
      throw new BadRequestException('Flow deployment not found!')
    }

    if (metadata.type === FLOW_METADATA.dqd) {
      const dqOptions = { ...metadata.options, deploymentName: deployment.name, flowName: currentFlow.name }
      return this.dataQualityService.createDataQualityFlowRun(dqOptions as DataQualityFlowRunDto)
    }

    if (metadata.type === FLOW_METADATA.data_characterization) {
      const dcOptions = { ...metadata.options, deploymentName: deployment.name }
      return this.dataCharacterizationService.createDataCharacterizationFlowRun(
        dcOptions as DataCharacterizationFlowRunDto
      )
    }

    if (metadata.options['options']) {
      metadata.options['options']['token'] = this.jwt
    }

    return await this.prefectApi.createFlowRun(
      metadata.flowRunName,
      deployment.name,
      currentFlow.name,
      metadata.options
    )
  }

  private async processPipPackage(userId: string, options: { fileName?: string; url?: string }) {
    const archiveExtensionRegex = /\.(tar\.gz|zip)$/
    const url = options.url
    let fileName = options.fileName
    try {
      if (!fileName) {
        const lastSlashIndex = url.lastIndexOf('/')
        fileName = url.slice(lastSlashIndex + 1)
      }
      const match = fileName.match(archiveExtensionRegex)
      const fileType = match ? match[0] : null
      const fileStem = fileName.replace(archiveExtensionRegex, '')
      const modifiedFileStem = fileStem.replace(/[.-]/g, '_')
      const deploymentFolderPath = join(PREFECT_ADHOC_FLOW_FOLDER_PATH, userId, modifiedFileStem)
      if (url) {
        mkdirSync(deploymentFolderPath, { recursive: true })
      }
      return {
        deploymentFolderPath,
        fileStem,
        modifiedFileStem,
        fileType
      }
    } catch (err) {
      const errorMessage = `Invalid Git URL or uploaded pip package`
      this.logger.error(`${errorMessage}: ${err}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  private async deleteDeploymentFolder(deploymentFolderPath: string) {
    rmdirSync(deploymentFolderPath, { recursive: true })
    this.logger.info(`Deleted adhoc prefect deployment folder: ${deploymentFolderPath}`)
  }

  private redactSensitivePrefectParameters(flowRunParameters: any) {
    const sensitivePrefectParameterKeys = ['token']

    if (!flowRunParameters.options) {
      return flowRunParameters
    }

    // Redact any values that have the keys found in redactSensitivePrefectParameters
    for (const sensitiveKey of sensitivePrefectParameterKeys) {
      if (sensitiveKey in flowRunParameters.options) {
        flowRunParameters.options[sensitiveKey] = '<REDACTED>'
      }
    }

    return flowRunParameters
  }
}
