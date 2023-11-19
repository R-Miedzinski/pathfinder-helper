import { Get, Route } from "tsoa";

interface PingResponse {
    message: string
}

@Route("/ping")
export default class PingController {

    @Get("/")
    static async getTestMessage(): Promise<PingResponse> {
        return {
            message: 'pong',
        }
    }
}
