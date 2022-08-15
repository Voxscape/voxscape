package io.jokester.nuthatch.scopes.user

import cats.effect.IO
import io.jokester.api.OpenAPIConvention.{Failable, FailableP}
import io.jokester.nuthatch.infra.ApiContext
import io.jokester.nuthatch.scopes.authn.TwitterOAuth1Flow
import io.jokester.nuthatch.scopes.user.UserApi.{OAuth1LoginIntent, OAuth1TempCred, UserProfile}

object UserApi {

  case class OAuth1TempCred(oauthToken: String, oauthVerifier: String)
  case class OAuth1LoginIntent(twitterUrl: String)

  case class EmailSignUpRequest(email: String, initialPassword: String)

  case class UserProfile(email: Option[String], isValid: Boolean)

}

object UserApiRoutes {
  val requestOA
}

class UserApi(val ctx: ApiContext) {

  def emailSignUp() = ???

  def twitterOAuth1: TwitterOAuth1Flow = new TwitterOAuth1Flow(ctx.getConfig("twitter_oauth1"), ctx)

  def requestTwitterOAuthLogin(): IO[OAuth1LoginIntent] = {
    twitterOAuth1.issueTwitterOAuthUrl().map(OAuth1LoginIntent)
  }
  def twitterLogin(cred: OAuth1TempCred): FailableP[UserProfile] = {
    ???
  }

}
