import { Request } from "express"

export type Payload = {
    _id: string
}

export type RequestWithUser = Request & {
    user?: Payload
}