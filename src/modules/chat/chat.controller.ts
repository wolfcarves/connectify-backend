import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as chatService from './chat.service';
import type { Body, QueryParams, RouteAndQueryParams } from '@/types/request';
import { chatSendMessageInputSchema } from './chat.schema';

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
		req: Request<
			never,
			never,
			{ content: string },
			{ chatId?: string; recipientId?: string }
		>,
		res: Response,
	) => {
		const senderId = res.locals.user!.id;
		const chatId = Number(req.query.chatId) || undefined;
		const recipientId = Number(req.query.recipientId) || undefined;
		const content = req.body.content;

		const response = await chatService.sendMessage(
			senderId,
			content,
			chatId,
			recipientId,
		);

		res.status(201).json({
			data: response,
		});
	},
);
