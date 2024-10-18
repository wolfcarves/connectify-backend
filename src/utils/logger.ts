import winston from 'winston';

const colorizer = winston.format.colorize();

const logger = winston.createLogger({
	level: 'info',
	defaultMeta: { service: 'user-service' },
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.simple(),
		winston.format.printf(msg =>
			colorizer.colorize(
				msg.level,
				`${msg.timestamp} - ${msg.level}: ${msg.message}`,
			),
		),
	),
	transports: [
		new winston.transports.Console(),
		// new winston.transports.File({ filename: 'logfile.log' }),
	],
});

export default logger;
