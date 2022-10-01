package io.jokester.nuthatch.generated.quill.twitter

case class TwitterUser(id: Int, twitterId: Long, twitterProfile: io.circe.Json, createdAt: java.time.OffsetDateTime)

trait TwitterExtensions[+Idiom <: io.getquill.idiom.Idiom, +Naming <: io.getquill.NamingStrategy] {
  this:io.getquill.context.Context[Idiom, Naming] =>

  object TwitterSchema {
    object TwitterUserDao {
        def query = quote {
            querySchema[TwitterUser](
              "twitter.twitter_user",
              _.id -> "id",
              _.twitterId -> "twitter_id",
              _.twitterProfile -> "twitter_profile",
              _.createdAt -> "created_at"
            )
                      
          }
                    
      }
  }
}
