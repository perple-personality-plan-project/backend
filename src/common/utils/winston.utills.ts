import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

// env 안읽힘
const env = 'production';

const dailyOptions = (level: string) => {
  console.log(env);
  console.log(env);
  console.log(env);
  console.log(env);
  console.log(env);
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: `logs/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 5, // 5일치 파일로그 저장
    zippedArchive: true, // 로그가 쌓이면 압축
  };
};

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: env === 'production' ? 'http' : 'debug',
      format:
        env === 'production'
          ? winston.format.simple()
          : winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike('Platter', {
                prettyPrint: true,
              }),
            ),
    }),

    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('warn')),
    new winstonDaily(dailyOptions('error')),
  ],
});
