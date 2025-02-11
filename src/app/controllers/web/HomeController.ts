import { ControllerAction } from "@/utils/References";

export class HomeController {
    static index: ControllerAction = (req, res) => {

        const viewModel = {
            title: 'Home Page',
            message: 'Home Page'
        };

        res.render('home/index', viewModel);
    }
}