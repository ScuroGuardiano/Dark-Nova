import * as express from 'express';
import logger from '@logger';
import { inspect } from 'util';
import { default as UserService, Errors as UserErrors } from '../../login/service';
import APIRequest from './interfaces/api-request';

const router = express.Router();
export default router;

const userService = new UserService();

/**
 * @api {post} /auth/register Register user
 * @apiVersion 1.0.0
 * @apiName Register
 * @apiGroup Auth
 * 
 * @apiParam {string} email User's email
 * @apiParam {string} password User's password
 * 
 * @apiParamExample {json} Request-Example:
 *      {
 *          "email": "example@gmail.com",
 *          "password": "V3ry_57r0ng_p4$$w0rd"
 *      }
 * 
 * @apiSuccess (Success Response (200)) {string}  token Session token
 * 
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          token: "2a707cba-e4ca-4c4b-a0ec-2a59a1a54041"
 *      }
 * 
 * @apiError (Error 4xx) INVALID_REQUEST Request is invalid, propably some params are missing
 * @apiError (Error 4xx) INVALID_EMAIL_FORMAT Param email is in invalid format. Make sure it's correct email
 * @apiError (Error 4xx) INVALID_PASSWORD_FORMAT Password is in invalid format. Make sure it's has proper length
 * @apiError (Error 4xx) ACCOUNT_ALREADY_EXISTS Account with this email already exists
 * 
 * @apiErrorExample {json} Error-Response:
 *      HTTP/1.1 400 Bad Request
 *      {
 *          "statusCode": 400,
 *          "error": "INVALID_EMAIL_FORMAT"
 *      }
 */
router.post('/register', async (req: APIRequest, res, next) => {
    try {
        if(!req.body.email || !req.body.password) {
            return res.json({
                statusCode: 400,
                error: "INVALID_REQUEST"
            });
        }
        const user = await userService.registerUser(req.body.email, req.body.password);
        const sessionToken = await req.sessionManager.createSession({ userId: user.id });
        return res.status(200).json({
            token: sessionToken
        });
    }
    catch(err) {
        if(err instanceof UserErrors.AccountAlreadyExists) {
            return res.status(400).json({
                statusCode: 400,
                error: "ACCOUNT_ALREADY_EXISTS"
            });
        }
        if(err instanceof UserErrors.InvalidEmailFormat) {
            return res.status(400).json({
                statusCode: 400,
                error: "INVALID_EMAIL_FORMAT"
            });
        }
        if(err instanceof UserErrors.InvalidPasswordFormat) {
            return res.status(400).json({
                statusCode: 400,
                error: "INVALID_PASSWORD_FORMAT"
            });
        }
        return next(err);
    }
});

/**
 * @api {post} /auth/login Login
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "email": "example@gmail.com",
 *          "password": "V3ry_57r0ng_p4$$w0rd"
 *      }
 *
 * @apiSuccess (Success Response (200)) {string}  token Session token
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          token: "2a707cba-e4ca-4c4b-a0ec-2a59a1a54041"
 *      }
 *
 * @apiError (Error 4xx) INVALID_REQUEST Request is invalid, propably some params are missing
 * @apiError (Error 4xx) WRONG_EMAIL_OR_PASSWORD Email or password is wrong
 *
 * @apiErrorExample {json} Error-Response:
 *      HTTP/1.1 400 Bad Request
 *      {
 *          "statusCode": 400,
 *          "error": "WRONG_EMAIL_OR_PASSWORD"
 *      }
 */
router.post('/login', async (req: APIRequest, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                statusCode: 400,
                error: "INVALID_REQUEST"
            });
        }
        const user = await userService.authUser(req.body.email, req.body.password);
        const sessionToken = await req.sessionManager.createSession({ userId: user.id });
        return res.status(200).json({
            token: sessionToken
        });
    }
    catch(err) {
        if(err instanceof UserErrors.WrongEmailOrPassword) {
            return res.status(400).json({
                statusCode: 400,
                error: "WRONG_EMAIL_OR_PASSWORD"
            });
        }
        return next(err);
    }
});
/**
 * @api {delete} /auth/destroy-session Destroy session
 * @apiVersion 1.0.0
 * @apiName DestroySession
 * @apiGroup Auth
 *
 * @apiParam {string} token SessionToken
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "token": "2a707cba-e4ca-4c4b-a0ec-2a59a1a54041"
 *      }
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 204 No Content
 * 
 * @apiError (Error 4xx) INVALID_REQUEST Request is invalid, propably some params are missing
 */
router.delete('/destroy-session', async (req: APIRequest, res, next) => {
    try {
        if(!req.body.token) {
            return res.status(400).json({
                statusCode: 400,
                error: "INVALID_REQUEST"
            });
        }
        await req.sessionManager.removeSession(req.body.token);
        return res.status(204).send();
    }
    catch(err) {
        next(err);
    }
});

router.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error("API::Login: %s", inspect(err));
    return res.send({
        statusCode: 500,
        error: "INTERNAL_ERROR"
    });
});
