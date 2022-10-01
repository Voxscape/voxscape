CREATE TABLE "public"."twitter_user" ("id" serial NOT NULL, "twitter_user_id" bigint NOT NULL, "twitter_user_profile" jsonb NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , UNIQUE ("twitter_user_id"));COMMENT ON TABLE "public"."twitter_user" IS E'snapshot of twitter users';
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
CREATE TRIGGER "set_public_twitter_user_updated_at"
BEFORE UPDATE ON "public"."twitter_user"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_twitter_user_updated_at" ON "public"."twitter_user" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
