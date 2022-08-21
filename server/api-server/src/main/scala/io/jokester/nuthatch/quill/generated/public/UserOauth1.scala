package io.jokester.nuthatch.quill.generated.public

case class UserOauth1(id: Int, userId: Int, provider: String, accessToken: String, accessTokenSecret: String, providerId: Option[String], providerProfile: io.circe.Json, createdAt: java.time.OffsetDateTime, updatedAt: java.time.OffsetDateTime)

trait PublicExtensions[+Idiom <: io.getquill.idiom.Idiom, +Naming <: io.getquill.NamingStrategy] {
  this:io.getquill.context.Context[Idiom, Naming] =>

  object PublicSchema {
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
