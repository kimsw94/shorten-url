import { Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpClean {
  async clientIpClean(req: Request) {
    let cleanIp;
    let clientIp = req.ip;

    if (clientIp.includes('::ffff:')) {
      cleanIp = clientIp.split('::ffff:')[1];
    } else {
      cleanIp = clientIp;
    }

    return cleanIp;
  }

  async serverIpClean(req: Request) {
    let cleanIp;
    let serverIp = req.connection.localAddress;

    if (serverIp.includes('::ffff:')) {
      cleanIp = serverIp.split('::ffff:')[1];
    } else {
      cleanIp = serverIp;
    }
    return cleanIp;
  }
}
