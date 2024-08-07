import winston from 'winston';

let logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),

	defaultMeta: { service: 'user-service' },
	transports: [],
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		}),
	);
}

export default logger;
