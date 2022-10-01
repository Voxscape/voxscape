package io.jokester.nuthatch.generated.quill.public

case class UserPassword(id: Int, userId: Int, passwordHash: String, createdAt: java.time.OffsetDateTime, updatedAt: java.time.OffsetDateTime)

case class TwitterUser(id: Int, twitterUserId: Long, twitterUserProfile: io.circe.Json, createdAt: java.time.OffsetDateTime, updatedAt: java.time.OffsetDateTime)

case class User(id: Int, email: String, profile: Option[io.circe.Json], createdAt: java.time.OffsetDateTime, updatedAt: java.time.OffsetDateTime)

case class UserOauth1(id: Int, userId: Int, provider: String, accessToken: String, accessTokenSecret: String, providerId: String, providerProfile: io.circe.Json, createdAt: java.time.OffsetDateTime, updatedAt: java.time.OffsetDateTime)

trait PublicExtensions[+Idiom <: io.getquill.idiom.Idiom, +Naming <: io.getquill.NamingStrategy] {
  this:io.getquill.context.Context[Idiom, Naming] =>

  object PublicSchema {
    object UserPasswordDao {
        def query = quote {
            querySchema[UserPassword](
              "public.user_password",
              _.id -> "id",
              _.userId -> "user_id",
              _.passwordHash -> "password_hash",
              _.createdAt -> "created_at",
              _.updatedAt -> "updated_at"
            )
                      
          }
                    
      }

      object TwitterUserDao {
        def query = quote {
            querySchema[TwitterUser](
              "public.twitter_user",
              _.id -> "id",
              _.twitterUserId -> "twitter_user_id",
              _.twitterUserProfile -> "twitter_user_profile",
              _.createdAt -> "created_at",
              _.updatedAt -> "updated_at"
            )
                      
          }
                    
      }

      object UserDao {
        def query = quote {
            querySchema[User](
              "public.user",
              _.id -> "id",
              _.email -> "email",
              _.profile -> "profile",
              _.createdAt -> "created_at",
              _.updatedAt -> "updated_at"
            )
                      
          }
                    
      }

      object UserOauth1Dao {
        def query = quote {
            querySchema[UserOauth1](
              "public.user_oauth1",
              _.id -> "id",
              _.userId -> "user_id",
              _.provider -> "provider",
              _.accessToken -> "access_token",
              _.accessTokenSecret -> "access_token_secret",
              _.providerId -> "provider_id",
              _.providerProfile -> "provider_profile",
              _.createdAt -> "created_at",
              _.updatedAt -> "updated_at"
            )
                      
          }
                    
      }
  }
}
