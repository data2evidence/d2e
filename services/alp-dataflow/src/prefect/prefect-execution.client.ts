import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { execSync, spawn } from 'child_process'
import { join } from 'path'
import { createLogger } from '../logger'
import { env } from '../env'
import { PREFECT_ADHOC_FLOW_FOLDER_PATH, PrefectDeploymentPythonFiles } from '../common/const'

@Injectable()
export class PrefectExecutionClient {
  private readonly logger = createLogger(this.constructor.name)

  spawnChildProcess(userId: string, folderName: string, fileName: string) {
    return new Promise((resolve, reject) => {
      this.logger.info('Running python...')
      let errorMsg = ''
      let command
      if (fileName == PrefectDeploymentPythonFiles['SCRIPT']) {
        command = spawn('python', [`${fileName}`], {
          cwd: join(PREFECT_ADHOC_FLOW_FOLDER_PATH, userId, folderName)
        })
      } else {
        command = spawn('/tmp/python_venv/bin/python', [`${fileName}`], {
          cwd: join(PREFECT_ADHOC_FLOW_FOLDER_PATH, userId, folderName)
        })
      }

      command.stdout.on('data', data => {
        this.logger.info(data)
      })

      command.stderr.on('data', data => {
        errorMsg += `${data.toString()}\n`
      })

      command.on('close', (code: number) => {
        if (code != 0) {
          this.logger.error('Error while executing deployment file')
          reject(errorMsg)
        } else {
          this.logger.info('Python child process completed!')
          resolve(code)
        }
      })
    })
  }

  executePythonPrefectModule = async (userId: string, folderName: string) => {
    const successMessage = 'Prefect flow deployed'
    try {
      this.logger.info('Executing Prefect deployment...')
      await execSync('prefect config set PREFECT_API_URL=http://alp-dataflow-gen:41120/api')

      await this.spawnChildProcess(userId, folderName, PrefectDeploymentPythonFiles['DEPLOYMENT'])
      this.logger.info(successMessage)
      return {
        message: successMessage
      }
    } catch (error) {
      const errorMessage = 'Error while deploying Prefect flow'
      this.logger.error(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }
  executeCreateVirtualEnvironment = async (userId: string, folderName: string) => {
    const successMessage = 'python virtual environment created'
    try {
      this.logger.info('creating python virtual environment...')
      await this.spawnChildProcess(userId, folderName, PrefectDeploymentPythonFiles['SCRIPT'])
      this.logger.info(successMessage)
      return {
        message: successMessage
      }
    } catch (error) {
      const errorMessage = 'Error while creating python virtual environment'
      this.logger.error(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  executePipInstall = async (userId: string, folderName: string) => {
    const successMessage = 'pip install finished'
    try {
      this.logger.info('Installing pip package...')
      await this.spawnChildProcess(userId, folderName, PrefectDeploymentPythonFiles['PIP_INSTALL'])
      this.logger.info(successMessage)
      return {
        message: successMessage
      }
    } catch (error) {
      const errorMessage = 'Error while installing pip package'
      this.logger.error(`${errorMessage}: ${error}`)
      throw new InternalServerErrorException(errorMessage)
    }
  }

  createInstallDependenciesScript = () => {
    return `import subprocess
import os
venv_cmd = ["python", "-m", "venv", "--system-site-packages", "/tmp/python_venv"]
subprocess.run(venv_cmd)
pip_freeze_output = subprocess.check_output(['pip', 'freeze']).decode('utf-8')

# Write the output to requirements.txt in the /tmp folder
requirements_file_path = '/tmp/requirements.txt'
with open(requirements_file_path, 'w') as requirements_file:
    requirements_file.write(pip_freeze_output)
system_packages_cmd = ["/tmp/python_venv/bin/pip", "install", "-r", "/tmp/requirements.txt"]
subprocess.run(system_packages_cmd)
    `
  }
  createPipInstallScript = (fileStem: string, fileExt: string, url?: string) => {
    this.logger.info(`zip file to install: ${fileStem}${fileExt}`)
    if (url && !(url.endsWith('.zip') || url.endsWith('.gz'))) {
      url = 'git+' + url
    }
    const installCmd = url ? url : fileStem.concat(fileExt)
    return `import subprocess
import os
install_cmd = ["/tmp/python_venv/bin/pip", "install", "${installCmd}", "--target", "."]
subprocess.run(install_cmd)
    `
  }

  createDeploymentTemplate = (userId: string, flowName: string, flowModulePath: string, tags: string[] = []) => {
    const formattedFlowName = flowName.replace(/-/g, '_')
    this.logger.info(`formatedFlowName: ${formattedFlowName}`)
    const s3Path = join(userId, formattedFlowName)
    const blockName = this.createValidBlockName(`${userId}-${formattedFlowName}`)
    const formattedTags = tags.length > 0 ? `tags=[${tags.map(tag => `'${tag}'`).join(',')}]` : 'tags=[]'

    return `from ${flowModulePath} import ${formattedFlowName}  
from prefect.deployments import Deployment, run_deployment
from prefect.filesystems import RemoteFileSystem as RFS

user_block = RFS(
  basepath="s3://${env.ADHOC_DEPLOYMENT_FLOWS_BUCKET_NAME}/${s3Path}",
  settings={
      "key": "${env.MINIO_ACCESS_KEY}",
      "secret": "${env.MINIO_SECRET_KEY}",
      "client_kwargs": {"endpoint_url": "http://${env.MINIO_ENDPOINT}:${env.MINIO_PORT}"},
  },
)
user_block.save("${blockName}", overwrite=True)

deployment = Deployment.build_from_flow(
  flow=${formattedFlowName},
  name="${flowName}_deployment",
  version="1",
  ${formattedTags},
  apply=True,
  storage=user_block,
  parameters={},
)
  
deployment.apply()`
  }

  private createValidBlockName(name: string) {
    return name
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/\W$/, '')
      .toLowerCase()
  }
}
