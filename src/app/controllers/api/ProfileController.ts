import { ControllerAction } from "@/utils/References.js";
import { Response } from "../../../utils/http/Response.js";
import { User } from "../../models/User.js";

export class ProfileController {
    static index: ControllerAction = async (req, res) => {
        const user = (await User.find(req.userId)) as User;

        res.json(Response.success('Anda berhasil mengakses endpoint ini', await user.load('roles')));
    }
}