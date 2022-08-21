CREATE TABLE "public"."user_password" ("id" serial NOT NULL, "user_id" integer NOT NULL, "password_hash" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE no action ON DELETE no action, UNIQUE ("id"), UNIQUE ("user_id"));
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_user_password_updated_at"
BEFORE UPDATE ON "public"."user_password"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_user_password_updated_at" ON "public"."user_password" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
