import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlService } from './api/url/url.service';
import { UrlController } from './api/url/url.controller';
import { UrlModule } from './api/url/url.module';

@Module({
  imports: [UrlModule],
  controllers: [AppController, UrlController],
  providers: [AppService, UrlService],
})
export class AppModule {}
