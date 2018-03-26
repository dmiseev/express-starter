import { Response } from 'express';
import { controller, httpDelete, httpGet, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { FriendRequest } from '../../Domain/FriendRequest/FriendRequest';
import { authMiddleware } from '../Middleware/CustomMiddleware';
import { IFriendRequestService } from '../../Domain/FriendRequest/IFriendRequestService';
import { IRequest } from '../../Utils/Request/custom';
import { serialize } from 'class-transformer';
import { FriendRequestDTO } from '../../Infrastructure/DTO/FriendRequest/FriendRequestDTO';
import * as validate from 'express-validation';
import * as friendRequestValidator from '../../Infrastructure/Validators/FriendRequest/FriendRequestValidator';

@controller('/friend-requests', authMiddleware)
export class FriendRequestController {

    constructor(@inject('IFriendRequestService') private friendRequestService: IFriendRequestService) {
    }

    /**
     * @param {IRequest} request
     * @param {Response} response
     *
     * @returns {Promise<void>}
     */
    @httpPost('/', validate(friendRequestValidator))
    public store(request: IRequest, response: Response) {

        return this.friendRequestService.store(
            request.user,
            FriendRequestDTO.fromRequest(request)
        );
    }

    /**
     * @param {Request} request
     * @returns {Promise<FriendRequest>}
     */
    @httpGet('/:id')
    public byId(request: IRequest,) {

        return this.friendRequestService.byId(parseInt(request.params.id))
            .then((friendRequest: FriendRequest) => {
                return serialize(friendRequest);
            });
    }

    /**
     * @param {Request} request
     * @param {Response} response
     */
    @httpDelete('/:id')
    public remove(request: IRequest, response: Response) {

        return this.friendRequestService.remove(parseInt(request.params.id))
            .then(() => {
                response.set('X-Items-Count', '0');
                response.status(204);
            });
    }
}