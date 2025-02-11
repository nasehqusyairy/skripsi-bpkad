import 'module-alias/register';
import { Schema } from "@/utils/database/migration/Schema";

export default class PostsTable {
    static async up() {
        await Schema.create('posts', (table) => {
            table.id();
            table.bigint('user_id');
            table.string('title').nullable();
            table.text('content').nullable();
            table.timestamp('created_at').default('CURRENT_TIMESTAMP',true);
            table.timestamp('updated_at').default('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',true);
        });
    }

    static async down() {
        await Schema.drop('posts');
    }
}