import { BaseController } from "./base_controller";
import { IComment } from "../models/comment_model";
import { CommentModel } from "../models/comment_model";
export class CommentController extends BaseController<IComment> {
    constructor() {
        super(CommentModel);
    }
}