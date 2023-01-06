CREATE TABLE "public"."twitter_friendship" ("id" bigserial NOT NULL, "twitter_user_id_1" bigint NOT NULL, "twitter_user_id_2" bigint NOT NULL, "following_1_2" boolean NOT NULL, "following_2_1" boolean NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , UNIQUE ("twitter_user_id_1", "twitter_user_id_2"), CONSTRAINT "ordered pair" CHECK (twitter_user_id_1 < twitter_user_id_2));
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
CREATE TRIGGER "set_public_twitter_friendship_updated_at"
BEFORE UPDATE ON "public"."twitter_friendship"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_twitter_friendship_updated_at" ON "public"."twitter_friendship" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
