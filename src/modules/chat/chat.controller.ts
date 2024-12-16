import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as chatService from './chat.service';
import type {
	QueryParams,
	RouteAndQueryParams,
	RouteParams,
} from '@/types/request';

export const createChat = asyncHandler(
	async (req: RouteParams<{ recipientId: string }>, res: Response) => {
		const userId = res.locals.user!.id;
		const recipientId = Number(req.params.recipientId);

		const { chat_id } = await chatService.createChat(userId, recipientId);

		res.status(201).json({
			data: {
				chat_id,
			},
		});
	},
);

export const getChat = asyncHandler(
	async (req: RouteParams<{ recipientId: string }>, res: Response) => {
		const userId = res.locals.user!.id;
		const recipientId = Number(req.params.recipientId);

		const chat = await chatService.getChat(userId, recipientId);

		res.status(201).json({
			data: chat,
		});
	},
);

export const getChats = asyncHandler(
	async (
		req: QueryParams<{ page: string; per_page: string }>,
		res: Response,
	) => {
		const userId = res.locals.user!.id;

		const page = Number(req.query.page) || 1;
		const perPage = Number(req.query.per_page) || 10;

		const { chats, total_items, remaining_items } =
			await chatService.getChats(userId, page, perPage);

		res.status(200).json({
			data: chats,
			pagination: {
				current_page: page,
				total_items,
				remaining_items,
			},
		});
	},
);

export const getChatMessages = asyncHandler(
	async (
		req: RouteAndQueryParams<
			{ chatId: string },
			{ page: string; per_page: string }
		>,
		res: Response,
	) => {
		const userId = res.locals.user!.id;
		const chatId = Number(req.params.chatId);

		const page = Number(req.query.page) || 1;
		const perPage = Number(req.query.per_page) || 10;

		const { chats, total_items, remaining_items } =
			await chatService.getChatMessages(userId, chatId, page, perPage);

		res.status(200).json({
			data: chats,
			pagination: {
				current_page: page,
				total_items,
				remaining_items,
			},
		});
	},
);

export const sendMessage = asyncHandler(
	async (
		req: Request<{ chatId: string }, never, { content: string }, never>,
		res: Response,
	) => {
		const senderId = res.locals.user!.id;
		const chatId = Number(req.params.chatId);
		const content = req.body.content;

		const response = await chatService.sendMessage(
			senderId,
			chatId,
			content,
		);

		res.status(201).json({
			data: response,
		});
	},
);
