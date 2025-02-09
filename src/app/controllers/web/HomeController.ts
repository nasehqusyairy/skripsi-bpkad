import { ControllerAction } from "@/utils/References";

export class HomeController {
    static index: ControllerAction = (req, res) => {

        const viewModel = {
            title: 'Halaman Home',
            message: 'Server Mitra'
        };

        res.render('home/index', viewModel);
    }
}