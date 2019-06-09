import APIResponse from "../interfaces/api-response";

export default function apiError(res: APIResponse, code: number, error: string) {
    return res.status(code).json({
        statusCode: code,
        error
    });
}
