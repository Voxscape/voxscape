package io.jokester.nuthatch.twitter

import cats.effect.IO
import io.circe.Json
import io.jokester.nuthatch.base.AppContextBase
import io.jokester.nuthatch.generated.quill.{public => T}
import twitter4j.{User => TwitterUser}

class TwitterStorageService(ctx: AppContextBase) {
  private case class NewTwitterUser(twitterId: Long, twitterProfile: Json)

  def upsertUsers(users: Seq[TwitterUser]): IO[Int] = {
    if (users.isEmpty) {
      return IO.pure(0)
    }

    IO {
      import ctx.quill._

      val insert = quote {
        liftQuery(users.map(u => NewTwitterUser(u.getId, ctx.quill.toJson(u))))
          .foreach(u =>
            query[T.TwitterUser]
              .insert(
                _.twitterUserId      -> u.twitterId,
                _.twitterUserProfile -> u.twitterProfile,
              ),
          )

      }

      val inserted = run(insert)

      inserted.length
    }
  }
}
