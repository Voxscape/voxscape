package io.jokester.nuthatch.quill.generated.public

case class UserOauth1Token(userOauth1TokenId: Int, userId: Int, provider: Int, token: String, tokenSecret: String, isValid: Boolean, createdAt: java.time.OffsetDateTime, updatedAt: java.time.OffsetDateTime)

case class User(userId: Int, username: String, isActivated: Boolean, createdAt: java.time.OffsetDateTime, updatedAt: java.time.OffsetDateTime)

case class UserPasswordAuth(userPasswordAuthId: Int, userId: Int, email: String, passwordHash: String, createdAt: java.time.OffsetDateTime, updatedAt: java.time.OffsetDateTime)

trait PublicExtensions[+Idiom <: io.getquill.idiom.Idiom, +Naming <: io.getquill.NamingStrategy] {
  this:io.getquill.context.Context[Idiom, Naming] =>

  object PublicSchema {
    object UserOauth1TokenDao {
        def query = quote {
            querySchema[UserOauth1Token](
              "public.user_oauth1_token",
              _.userOauth1TokenId -> "user_oauth1_token_id",
              _.userId -> "user_id",
              _.provider -> "provider",
              _.token -> "token",
              _.tokenSecret -> "token_secret",
              _.isValid -> "is_valid",
              _.createdAt -> "created_at",
              _.updatedAt -> "updated_at"
            )
                      
          }
                    
      }

      object UserDao {
        def query = quote {
            querySchema[User](
              "public.user",
              _.userId -> "user_id",
              _.username -> "username",
              _.isActivated -> "is_activated",
              _.createdAt -> "created_at",
              _.updatedAt -> "updated_at"
            )
                      
          }
                    
      }

      object UserPasswordAuthDao {
        def query = quote {
            querySchema[UserPasswordAuth](
              "public.user_password_auth",
              _.userPasswordAuthId -> "user_password_auth_id",
              _.userId -> "user_id",
              _.email -> "email",
              _.passwordHash -> "password_hash",
              _.createdAt -> "created_at",
              _.updatedAt -> "updated_at"
            )
                      
          }
                    
      }
  }
}
