package io.jokester.nuthatch.twitter

import cats.effect.IO
import io.jokester.nuthatch.base.AppContext
import twitter4j.{User => TwitterUser}

class TwitterStorageService(ctx: AppContext) {

  def upsertUsers(users: Seq[TwitterUser]): IO[Unit] = {
    IO {}
  }
}
