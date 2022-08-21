package io.jokester.nuthatch.quill.generated.public

case class User(id: Int, email: String, profile: Option[io.circe.Json], createdAt: java.time.OffsetDateTime, updatedAt: java.time.OffsetDateTime)

trait PublicExtensions[+Idiom <: io.getquill.idiom.Idiom, +Naming <: io.getquill.NamingStrategy] {
  this:io.getquill.context.Context[Idiom, Naming] =>

  object PublicSchema {
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
  }
}
