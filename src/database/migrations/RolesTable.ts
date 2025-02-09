import 'module-alias/register';
import { Schema } from "@/utils/database/migration/Schema";

export default class RolesTable {
    static async up() {
        await Schema.create('roles', (table) => {
            table.id();
            table.string('name').nullable();
            table.timestamp('created_at').default('CURRENT_TIMESTAMP',true);
            table.timestamp('updated_at').default('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',true);
        });
    }

    static async down() {
        await Schema.drop('roles');
    }
}