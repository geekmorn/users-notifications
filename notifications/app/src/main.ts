import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.NOTIFICATIONS_APP_PORT ?? 3021

  await app.listen(port)
}
bootstrap()
