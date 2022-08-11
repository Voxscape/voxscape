alter table "public"."user" add constraint "username_lowercased" check (LOWER(username) = username);
