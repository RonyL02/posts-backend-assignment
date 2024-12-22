import { BaseController } from "./base_controller";
import { IUser, UserModel } from "../models/user_model";
export class UserController extends BaseController<IUser> {
    constructor() {
        super(UserModel);
    }
}