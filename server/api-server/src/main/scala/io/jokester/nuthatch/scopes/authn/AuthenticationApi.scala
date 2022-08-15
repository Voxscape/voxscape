package io.jokester.nuthatch.scopes.authn

import io.circe.generic.auto._
import io.jokester.api.OpenAPIConvention
import sttp.tapir.generic.auto._
import sttp.tapir.json.circe.jsonBody
import sttp.tapir.{Endpoint, endpoint, path}

object AuthenticationApi {
  private val basePath = endpoint.in("authn").errorOut(OpenAPIConvention.defaultErrorOutputMapping)

  object User {
    case class UserProfile(email: Option[String], isActivated: Boolean)
  }

  object OAuth1 {
    case class OAuth1TempCred(provider: String, oauthToken: String, oauthVerifier: String)
    case class OAuth1LoginIntent(externalUrl: String)

    val requestOAuthAuth
        : Endpoint[Unit, String, OpenAPIConvention.ApiError, OAuth1LoginIntent, Any] =
      basePath.post.in("oauth1").in(path[String]("provider")).out(jsonBody[OAuth1LoginIntent])

    val verifyOAuth1Auth
        : Endpoint[Unit, OAuth1TempCred, OpenAPIConvention.ApiError, User.UserProfile, Any] =
      basePath.post
        .in("oauth1")
        .in("verify")
        .in(jsonBody[OAuth1TempCred])
        .out(jsonBody[User.UserProfile])
  }

  object Password {
    case class EmailSignUpRequest(email: String, initialPassword: String)

    val requestPasswordSignUp
        : Endpoint[Unit, EmailSignUpRequest, OpenAPIConvention.ApiError, User.UserProfile, Any] =
      basePath.post.in("password").in(jsonBody[EmailSignUpRequest]).out(jsonBody[User.UserProfile])

    case class EmailLoginCred(email: String, initialPassword: String)

    val requestPasswordLogin
        : Endpoint[Unit, EmailLoginCred, OpenAPIConvention.ApiError, User.UserProfile, Any] =
      basePath.post.in("password").in(jsonBody[EmailLoginCred]).out(jsonBody[User.UserProfile])

  }

}
