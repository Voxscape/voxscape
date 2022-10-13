alter table "public"."twitter_friendship" alter column "following_2_1" drop not null;
alter table "public"."twitter_friendship" add column "following_2_1" bool;
