export default function apiError(code: number, error: string) {
    return {
        statusCode: code,
        error
    };
}
