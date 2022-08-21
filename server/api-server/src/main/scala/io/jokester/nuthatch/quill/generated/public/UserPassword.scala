package io.jokester.nuthatch.quill.generated.public

case class UserPassword(id: Int, userId: Int, passwordHash: String, createdAt: java.time.OffsetDateTime, updatedAt: java.time.OffsetDateTime)

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
  }
}
