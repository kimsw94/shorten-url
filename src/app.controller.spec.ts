import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { UrlController } from './api/url/url.controller';
import { Url } from 'url';

describe('AppController', () => {
  let appController: AppController;
  let urlController: UrlController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController, UrlController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
    urlController = app.get<UrlController>(UrlController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getRoot()).toBe('Hello World!');
    });
  });
});
