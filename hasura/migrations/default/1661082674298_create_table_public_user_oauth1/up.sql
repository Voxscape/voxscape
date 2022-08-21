CREATE TABLE "public"."user_oauth1" ("id" serial NOT NULL, "user_id" integer NOT NULL, "provider" text NOT NULL, "access_token" text NOT NULL, "access_token_secret" text NOT NULL, "provider_id" text, "provider_profile" jsonb NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE no action ON DELETE no action, UNIQUE ("id"), UNIQUE ("user_id", "provider"), UNIQUE ("provider", "provider_id"));
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
CREATE TRIGGER "set_public_user_oauth1_updated_at"
BEFORE UPDATE ON "public"."user_oauth1"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_user_oauth1_updated_at" ON "public"."user_oauth1" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
