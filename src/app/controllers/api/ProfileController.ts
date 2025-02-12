import { User } from "@/app/models/User";
import { Response } from "@/utils/http/Response";
import { ControllerAction } from "@/utils/References";


export class ProfileController {
    static index: ControllerAction = async (req, res) => {
        const user = await User.find(req.userId);

        res.json(Response.success('Anda berhasil mengakses endpoint ini', await user.load('posts', 'roles')));
    }
}