alter table "public"."user" drop constraint "email_lowercased";
alter table "public"."user" add constraint "email_smallcase" check (CHECK (lower(email) = email));
