CREATE TABLE "public"."user_password_auth" ("user_password_auth_id" serial NOT NULL, "user_id" integer NOT NULL, "email" text NOT NULL, "password_hash" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("user_password_auth_id") , FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON UPDATE no action ON DELETE no action, UNIQUE ("user_id"), UNIQUE ("email"), CONSTRAINT "email_lowercase" CHECK (LOWER(email) = email));
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
CREATE TRIGGER "set_public_user_password_auth_updated_at"
BEFORE UPDATE ON "public"."user_password_auth"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_user_password_auth_updated_at" ON "public"."user_password_auth" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
