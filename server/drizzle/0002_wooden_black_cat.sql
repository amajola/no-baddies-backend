DO $$ BEGIN
 ALTER TABLE "post_users_groups" ADD CONSTRAINT "post_users_groups_user_name_user_name_fk" FOREIGN KEY ("user_name") REFERENCES "public"."user"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_users_groups" ADD CONSTRAINT "post_users_groups_group_name_groups_name_fk" FOREIGN KEY ("group_name") REFERENCES "public"."groups"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
