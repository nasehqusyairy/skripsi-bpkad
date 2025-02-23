import { Post } from "@/app/models/Post";
import { ControllerAction } from "@/utils/References";

export class PostController {
    static index: ControllerAction = async (req, res) => {

        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const perPage = 5;

        const userId = parseInt(req.session.userId.toString());

        const pagination = await Post.with("user").where({ user_id: userId }).paginate(page, perPage);
        res.render("posts/index", { pagination });
    }

    static show: ControllerAction = (req, res) => {
        // TODO: Implement show logic
    }

    static create: ControllerAction = (req, res) => {
        res.render("posts/create");
    }

    static store: ControllerAction = async (req, res) => {

        Post.create({
            ...req.body,
            user_id: req.session.userId
        });

        req.flash("success", "New post has been created!");

        res.redirect("/posts");
    }

    static edit: ControllerAction = async (req, res) => {
        const post = await Post.find(req.params.id);
        res.render("posts/edit", { post });
    }

    static update: ControllerAction = async (req, res) => {
        const post = Post.assign({
            ...req.body,
            id: req.params.id
        });

        await post.save();

        req.flash("success", "Post has been updated!");

        res.redirect("/posts");
    }

    static delete: ControllerAction = async (req, res) => {
        await Post.delete(req.params.id);
        req.flash("success", "Post has been deleted!");
        res.redirect("/posts");
    }
}