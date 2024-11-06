import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as friendService from '../friend/friend.service';

export const getFriendsSuggestions = asyncHandler(
	async (
		req: Request<never, never, { ip?: string }, never>,
		res: Response,
	) => {
		const userId = res.locals.user!.id;

		const suggestedFriends =
			await friendService.getFriendsSuggestions(userId);

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
			message: 'Friend request sent.',
		});
	},
);

export const cancelFriendRequest = asyncHandler(
	async (
		req: Request<{ requesterId: string }, never, never, never>,
		res: Response,
	) => {
		const userId = res.locals.user!.id;
		const { requesterId } = req.params;

		await friendService.deleteFriendRequest(
			Number(userId),
			Number(requesterId),
		);

		res.status(200).send({
			success: true,
			message: 'Friend request cancelled.',
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
	async (
		req: Request<{ userId: string }, never, never, never>,
		res: Response,
	) => {
		const user = res.locals.user!;
		const { userId } = req.params;

		const response = await friendService.getFriendList(
			user.id,
			Number(userId),
		);

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
