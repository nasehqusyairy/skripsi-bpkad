// NOTE: BACA DOKUMENTASI zod di https://zod.dev/

import { Validator } from "@/utils/Validator";
import { z } from "zod";

class AssignRoleValidator extends Validator {

    // Definisi aturan validasi
    rules() {
        return z.object({
            role_id: z.string({
                required_error: "Please select a role to assign.",
            })
        })
    }

}

export const AssignRoleRequest = new AssignRoleValidator().validate;