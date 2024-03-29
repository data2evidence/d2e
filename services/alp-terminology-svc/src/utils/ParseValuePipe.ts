import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

interface ParseValuePipeOptions {
  isOptional?: boolean;
}

@Injectable()
export class ParseValuePipe implements PipeTransform {
  private readonly options: ParseValuePipeOptions;
  constructor(options: ParseValuePipeOptions) {
    this.options = options;
  }
  transform(value: any, _metadata: ArgumentMetadata) {
    const { isOptional } = this.options;
    if (isOptional || value !== undefined) {
      return value;
    }
    throw new BadRequestException(`Invalid param: ${value}`);
  }
}
