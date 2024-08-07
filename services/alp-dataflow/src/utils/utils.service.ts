import { Injectable } from '@nestjs/common'

@Injectable()
export class UtilsService {
  regexMatcher(result: any[]): string[] {
    const regex = /\[s3:\/\/[^)]+\]/
    return result
      .map(item => item.description.match(regex))
      .filter(match => match)
      .flat()
  }

  extractRelativePath(path: string): string | null {
    const prefix = 's3://flows/'
    const start = path.indexOf(prefix)
    if (start === -1) return null

    const end = path.indexOf(')', start)
    if (end === -1) return path.substring(start + prefix.length)

    return path.substring(start + prefix.length, end)
  }
}
