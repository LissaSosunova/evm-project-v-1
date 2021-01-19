import { Router } from 'express';
import { DeleteChatController } from '../../controllers/chat/delete_chat.controller';
import { DeleteDraftMessageController } from '../../controllers/chat/delete_draft_message.controller';
import { GetDraftMessageController } from '../../controllers/chat/get_draft_message';
import { GetPrivateChatController } from '../../controllers/chat/get_private_chat.controller';
import { NewPrivateChatController } from '../../controllers/chat/new_private_chat.controller';
import { RenewChatController } from '../../controllers/chat/renew_chat.controller';
import { SetDraftMessageController } from '../../controllers/chat/set_draft_message.controller';
import { verifyToken } from '../../middlewares/check_Jwt';

const chatRoutes = Router();

chatRoutes.delete('/delete_chat/:contactId', [verifyToken], new DeleteChatController().delete.bind(new DeleteChatController()));
chatRoutes.delete('/delete_draft_message/:chatID/',
                    [verifyToken],
                    new DeleteDraftMessageController().delete.bind(new DeleteDraftMessageController()));
chatRoutes.get('/get_draft_message/:chatId',
                [verifyToken],
                new GetDraftMessageController().getMessage.bind(new GetDraftMessageController()));
chatRoutes.post('/new_private_chat', [verifyToken], new NewPrivateChatController().createChat.bind(new NewPrivateChatController()));
chatRoutes.get('/private_chat/:chatId', [verifyToken], new GetPrivateChatController().getChat.bind(new GetPrivateChatController()));
chatRoutes.put('/renew_chat/:contactId', [verifyToken], new RenewChatController().renewChat.bind(new RenewChatController()));
chatRoutes.post('/set_draft_message', [verifyToken], new SetDraftMessageController().setMessage.bind(new SetDraftMessageController()));


export default chatRoutes;
