import {
	badRequestErrorSchema,
	conflictErrorSchema,
	forbiddenErrorSchema,
	notFoundErrorSchema,
	serverErrorSchema,
	unauthorizedErrorSchema,
	validationErrorSchema,
} from '@/schema/errorSchema';

export const badRequestErrorResponse = {
	400: {
		description: 'Bad Request Error',
		content: {
			'application/json': {
				schema: badRequestErrorSchema,
			},
		},
	},
};

export const validationErrorResponse = {
	400: {
		description: 'Validation Error',
		content: {
			'application/json': {
				schema: validationErrorSchema,
			},
		},
	},
};

export const unauthorizedErrorResponse = {
	401: {
		description: 'Unauthorized',
		content: {
			'application/json': {
				schema: unauthorizedErrorSchema,
			},
		},
	},
};

export const forbiddenErrorResponse = {
	403: {
		description: 'Forbidden',
		content: {
			'application/json': {
				schema: forbiddenErrorSchema,
			},
		},
	},
};

export const notFoundErrorResponse = {
	401: {
		description: 'Not Found',
		content: {
			'application/json': {
				schema: notFoundErrorSchema,
			},
		},
	},
};

export const conflictErrorResponse = {
	409: {
		description: 'Conflict',
		content: {
			'application/json': {
				schema: conflictErrorSchema,
			},
		},
	},
};

export const serverErrorResponse = {
	500: {
		description: 'Server Internal Error.',
		content: {
			'application/json': {
				schema: serverErrorSchema,
			},
		},
	},
};
