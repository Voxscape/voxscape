package io.jokester.nuthatch.quill.generated.public

case class User(userId: Int, email: String, username: String, isActivated: Boolean, createdAt: java.time.OffsetDateTime, updatedAt: java.time.OffsetDateTime)

trait PublicExtensions[+Idiom <: io.getquill.idiom.Idiom, +Naming <: io.getquill.NamingStrategy] {
  this:io.getquill.context.Context[Idiom, Naming] =>

  object PublicSchema {
    object UserDao {
        def query = quote {
            querySchema[User](
              "public.user",
              _.userId -> "user_id",
              _.email -> "email",
              _.username -> "username",
              _.isActivated -> "is_activated",
              _.createdAt -> "created_at",
              _.updatedAt -> "updated_at"
            )
                      
          }
                    
      }
  }
}
