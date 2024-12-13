import type { Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as chatService from './chat.service';
import type { Body, QueryParams, RouteAndQueryParams } from '@/types/request';
import { socketIO } from '@/lib/socket';

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

export const getChatConversation = asyncHandler(
	async (
		req: RouteAndQueryParams<
			{ friendId: string },
			{ page: string; per_page: string }
		>,
		res: Response,
	) => {
		const userId = res.locals.user!.id;
		const friendId = Number(req.params.friendId);

		const page = Number(req.query.page) || 1;
		const perPage = Number(req.query.per_page) || 10;

		// const { chats, total_items, remaining_items } =
		await chatService.getChatConversation(userId, friendId, page, perPage);
	},
);

export const sendMessage = asyncHandler(
	async (
		req: Body<{ recipientId: string; message: string }>,
		res: Response,
	) => {
		const socket = socketIO();

		const userId = res.locals.user!.id;
		const message = req.body.message;
		const recipientId = Number(req.body.recipientId);

		socket.emit('receive_message', message);

		// await sendMessageInputSchema.parseAsync({
		// 	recipientId,
		// 	message,
		// });

		// const response = await chatService.sendMessage(
		// 	userId,
		// 	recipientId,
		// 	message,
		// );

		res.status(201).json({
			data: 'success',
			// data: response,
		});
	},
);
