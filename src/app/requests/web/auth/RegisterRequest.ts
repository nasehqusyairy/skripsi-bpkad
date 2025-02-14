import { User } from "@/app/models/User";
import { Validator } from "@/utils/Validator";
import { z } from "zod";

class RegisterValidator extends Validator {

    // Definisi aturan validasi
    rules() {
        return z.object({
            email: z.string().email(),
            password: z.string().min(6),
            password_confirmation: z.string(),
        }).superRefine(async (data, ctx) => {
            if (data.password !== data.password_confirmation) {
                ctx.addIssue({
                    path: ["password_confirmation"],
                    message: "Password confirmation doesn't match",
                    code: "custom"
                });
            }

            const user = await User.where("email", data.email).first();

            if (user) {
                ctx.addIssue({
                    path: ["email"],
                    message: "Email already taken",
                    code: "custom"
                });
            }

        });
    }

}

export const RegisterRequest = new RegisterValidator().validate;