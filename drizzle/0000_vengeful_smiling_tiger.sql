DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('admin', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"description" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_groups" (
	"user_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	"role" "role" NOT NULL,
	CONSTRAINT "users_to_groups_user_id_group_id_pk" PRIMARY KEY("user_id","group_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	"title" text NOT NULL,
	"is_count_down" boolean NOT NULL,
	"count_down_date" timestamp with time zone,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_groups" ADD CONSTRAINT "users_to_groups_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_groups" ADD CONSTRAINT "users_to_groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_group_id_user_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
