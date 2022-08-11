CREATE TABLE "public"."user_oauth1_token" ("user_oauth1_token_id" serial NOT NULL, "user_id" integer NOT NULL, "provider" integer NOT NULL, "token" text NOT NULL, "token_secret" text NOT NULL, "is_valid" boolean NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("user_oauth1_token_id") , FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("user_id", "provider"));
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
CREATE TRIGGER "set_public_user_oauth1_token_updated_at"
BEFORE UPDATE ON "public"."user_oauth1_token"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_user_oauth1_token_updated_at" ON "public"."user_oauth1_token" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
