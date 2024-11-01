import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as friendService from '../friend/friend.service';

export const getFriendsSuggestions = asyncHandler(
	async (
		req: Request<never, never, { ip?: string }, never>,
		res: Response,
	) => {
		const userId = res.locals.user!.id;
		//This is for remembering offset to avoid invalidation issues
		const latestUserId = req.cookies.latestUserId;

		// const { ip } = req.body;

		// if (ip) {
		// 	const fetchLocation = await fetch(`https://ipapi.co/${ip}/json`);
		// 	const location = await fetchLocation.json();

		// 	const suggestedFriends = await userService.getAllUsers({
		// 		limit: 20,
		// 	});

		// 	res.status(200).json({
		// 		data: suggestedFriends,
		// 	});
		// }

		const { friendRequestOffset, suggestedFriends } =
			await friendService.getFriendsSuggestions(userId, latestUserId);

		res.cookie('friendRequestOffset', friendRequestOffset, {
			path: '/',
			httpOnly: true,
			maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
		});

		res.status(200).json({
			data: suggestedFriends,
		});
	},
);

export const sendFriendRequest = asyncHandler(
	async (
		req: Request<{ receiverId: string }, never, never, never>,
		res: Response,
	) => {
		const senderId = res.locals.user!.id;
		const { receiverId } = req.params;

		await friendService.createFriendRequest(
			Number(senderId),
			Number(receiverId),
		);

		res.status(200).send({
			success: true,
			message: 'Friend Request Sent',
		});
	},
);

export const cancelFriendRequest = asyncHandler(
	async (
		req: Request<{ receiverId: string }, never, never, never>,
		res: Response,
	) => {
		const senderId = res.locals.user!.id;
		const { receiverId } = req.params;

		await friendService.deleteFriendRequest(
			Number(senderId),
			Number(receiverId),
		);

		res.status(200).send({
			success: true,
			message: 'Friend Request Cancelled',
		});
	},
);

export const getFriendRequests = asyncHandler(
	async (req: Request, res: Response) => {
		const user = res.locals.user!;

		const friendRequests = await friendService.getFriendRequests(user.id);

		res.status(200).send({
			data: friendRequests,
		});
	},
);

export const acceptFriendRequest = asyncHandler(
	async (
		req: Request<{ friendId: string }, never, never, never>,
		res: Response,
	) => {
		const user = res.locals.user!;
		const friendId = Number(req.params.friendId);

		await friendService.acceptFriendRequest(user.id, friendId);

		res.status(200).send({
			success: true,
			message: 'Request Accepted',
		});
	},
);

export const getFriendList = asyncHandler(
	async (req: Request, res: Response) => {
		const userId = res.locals.user!.id;

		const response = await friendService.getFriendList(userId);

		res.status(200).send({
			data: response,
		});
	},
);

export const unfriendUser = asyncHandler(
	async (
		req: Request<{ friendId: string }, never, never, never>,
		res: Response,
	) => {
		const userId = res.locals.user!.id;
		const friendId = req.params.friendId;

		await friendService.unfriendUser(userId, Number(friendId));

		res.status(200).send({
			success: true,
			message: 'Unfriend successful',
		});
	},
);
