// NOTE: BACA DOKUMENTASI zod di https://zod.dev/

import { Role } from "@/app/models/Role";
import { Validator } from "@/utils/Validator";
import { z } from "zod";

class RoleValidator extends Validator {

    // Definisi aturan validasi
    rules() {
        return z.object({
            // pengecekan input
            name: z.string(),
            id: z.preprocess(val => parseInt(z.string().parse(val)), z.number()).optional()

        }).superRefine(async ({ name, id }, ctx) => {
            // pengecekan database
            const query = Role.where({ name });
            if (id) {
                query.whereNot({ id });
            }
            const role = await query.first();
            if (role) {
                ctx.addIssue({
                    path: ["name"],
                    message: "Role with this name already exists",
                    code: "custom"
                });
            }
        });
    }

}

export const RoleRequest = new RoleValidator().validate;