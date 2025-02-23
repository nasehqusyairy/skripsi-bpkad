import { IUser, User } from "@/app/models/User";
import { ControllerAction } from "@/utils/References";

export class DashboardController {
    static index: ControllerAction = async (req, res) => {

        const user = await User.find(req.session.userId);

        const viewModel = {
            email: user.attributes.email
        }

        res.render("dashboard/index", viewModel);
    }
}