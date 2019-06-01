import APIRequest from "../interfaces/api-request";
import { NextFunction } from "express";
import APIResponse from "../interfaces/api-response";
import logger from "@logger";

/**
 * Checks if player exists
```js
    {
        statusCode: 404,
        error: "PLAYER_NOT_FOUND"
    }
```
 */
export default async function requirePlayer(req: APIRequest, res: APIResponse, next: NextFunction) {
    try {
        
    }
    catch (err) {

    }
}