alter table "public"."twitter_friendship" add constraint "ordered pair" check (CHECK (twitter_user_id_1 < twitter_user_id_2));
