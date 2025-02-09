import 'module-alias/register';
import { Schema } from "@/utils/database/migration/Schema";

export default class UsersTable {
    static async up() {
        await Schema.create('users', (table) => {
            table.id();
            table.string('email');
            table.text('password');
            table.timestamp('created_at').default('CURRENT_TIMESTAMP',true);
            table.timestamp('updated_at').default('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',true);
        });
    }

    static async down() {
        await Schema.drop('users');
    }
}