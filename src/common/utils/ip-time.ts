import { AppRepository } from '../../repo/app.repository';
import { UrlDTO } from '../../dtos/app.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class IpTime {
  constructor(private readonly appRepository: AppRepository) {}
    async formatDateTime(date: Date) {
      const options: Intl.DateTimeFormatOptions = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
        timeZoneName: 'short',
      };
    
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const formattedDateTime = formatter.format(date);
    
      return formattedDateTime;
    }
  }

