import { BaseController } from "./base_controller";
import {IPost, PostModel}  from "../models/post_model";
export class PostController extends BaseController<IPost> {
    constructor() {
        super(PostModel);
    }
}