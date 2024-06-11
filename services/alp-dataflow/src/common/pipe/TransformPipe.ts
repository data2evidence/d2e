import { ValidationPipe } from '@nestjs/common'

export const transformPipe = new ValidationPipe({ transform: true })
