import {CorsOptions} from '@nestjs/common/interfaces/external/cors-options.interface';

const whitelist = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  //   'http://localhost:80',
  //   'http://localhost:8080',
];

export const corsOptions: CorsOptions = {
  origin: true,
  // preflightContinue: true,
  credentials: true,
  optionsSuccessStatus: 200,
};

export const corsApollOptions: CorsOptions = {
  origin: whitelist,
  // preflightContinue: true,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST'],
};
