import 'module-alias/register';
import { Schema } from "@/utils/database/migration/Schema";

export default class RoleUserTable {
    static async up() {
        await Schema.create('role_user', (table) => {
            table.id();
            table.bigint('user_id').nullable();
            table.bigint('role_id').nullable();
            table.timestamp('created_at').default('CURRENT_TIMESTAMP',true);
            table.timestamp('updated_at').default('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',true);
        });
    }

    static async down() {
        await Schema.drop('role_user');
    }
}