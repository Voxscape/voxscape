alter table "public"."user" drop constraint "email_smallcase";
alter table "public"."user" add constraint "email_lowercased" check (lower(email) = email);
