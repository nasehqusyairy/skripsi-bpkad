import 'module-alias/register';
import { Schema } from "@/utils/database/migration/Schema";

export default class CommentsTable {
    static async up() {
        await Schema.create('comments', (table) => {
            table.id();
            table.bigint('user_id');
            table.bigint('post_id');
            table.text('body');
            table.timestamp('created_at').default('CURRENT_TIMESTAMP',true);
            table.timestamp('updated_at').default('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',true);
        });
    }

    static async down() {
        await Schema.drop('comments');
    }
}