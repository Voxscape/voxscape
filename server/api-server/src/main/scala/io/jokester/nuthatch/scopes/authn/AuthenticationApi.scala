package io.jokester.nuthatch.scopes.authn

import io.circe.generic.auto._
import io.jokester.api.OpenAPIConvention
import io.jokester.api.OpenAPIConvention.ApiError
import sttp.tapir.generic.auto._
import sttp.tapir.json.circe.jsonBody
import sttp.tapir.{Endpoint, endpoint, path}

object AuthenticationApi {
  private val basePath = endpoint.in("authn").errorOut(OpenAPIConvention.defaultErrorOutputMapping)

  case class CurrentUser(
      email: Option[String],
      isActivated: Boolean,
      profile: UserProfile,
  )

  /** @param email
    * @param isActivated
    * @param twitterUsername
    */
  case class UserProfile(
      twitterUsername: Option[String] = None,
  )

  object OAuth1 {
    case class OAuth1LoginIntent(externalUrl: String)

    val requestOAuthAuth
        : Endpoint[Unit, String, OpenAPIConvention.ApiError, OAuth1LoginIntent, Any] =
      basePath.post.in("oauth1").in(path[String]("provider")).out(jsonBody[OAuth1LoginIntent])

    case class OAuth1TempCred(provider: String, oauthToken: String, oauthVerifier: String)
    val verifyOAuth1Auth
        : Endpoint[Unit, OAuth1TempCred, OpenAPIConvention.ApiError, CurrentUser, Any] =
      basePath.post
        .in("oauth1")
        .in("verify")
        .in(jsonBody[OAuth1TempCred])
        .out(jsonBody[CurrentUser])
  }

  object Password {
    case class EmailSignUpRequest(email: String, initialPassword: String)

    val requestPasswordSignUp
        : Endpoint[Unit, EmailSignUpRequest, OpenAPIConvention.ApiError, CurrentUser, Any] =
      basePath.post.in("password").in(jsonBody[EmailSignUpRequest]).out(jsonBody[CurrentUser])

    case class EmailLoginCred(email: String, initialPassword: String)

    val requestPasswordLogin
        : Endpoint[Unit, EmailLoginCred, OpenAPIConvention.ApiError, CurrentUser, Any] =
      basePath.post.in("password").in(jsonBody[EmailLoginCred]).out(jsonBody[CurrentUser])
  }

}
