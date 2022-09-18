package io.jokester.nuthatch.authn

import com.typesafe.scalalogging.LazyLogging
import io.circe.Json
import io.circe.generic.auto._
import io.jokester.api.OpenAPIConvention
import io.jokester.circe.JsonSerializable
import sttp.tapir._
import sttp.tapir.generic.auto._
import sttp.tapir.json.circe.jsonBody
import sttp.tapir.{Endpoint, endpoint, path}

object AuthenticationApi {
  private val basePath = endpoint.in("authn").errorOut(OpenAPIConvention.defaultErrorOutputMapping)

  case class CurrentUser(
      userId: Int,
      email: Option[String],
      isActivated: Boolean,
      profile: UserProfile = UserProfile(),
  )

  case class UserProfile(username: Option[String] = None, twitterUsername: Option[String] = None)
      extends JsonSerializable[UserProfile] {

    def toJson: Json = {
      import io.circe.generic.semiauto._
      val encoder = deriveEncoder[UserProfile]
      encoder(this)
    }
  }

  object UserProfile extends LazyLogging {

    import io.circe.generic.semiauto._

    private val decoder = deriveDecoder[UserProfile]

    def fromJson(json: Json): UserProfile = {
      decoder.decodeJson(json).getOrElse(UserProfile())
    }
  }

  object OAuth1 {
    case class OAuth1LoginIntent(externalUrl: String)

    val startAuth: Endpoint[Unit, String, OpenAPIConvention.ApiError, OAuth1LoginIntent, Any] =
      basePath.post
        .in("oauth1" / "start")
        .in(path[String]("provider"))
        .out(jsonBody[OAuth1LoginIntent])
        .name("authnOauth1StartAuth")

    case class OAuth1TempCred(provider: String, oauthToken: String, oauthVerifier: String)

    val finishAuth: Endpoint[Unit, OAuth1TempCred, OpenAPIConvention.ApiError, CurrentUser, Any] =
      basePath.post
        .name("authnOauth1FinishAuth")
        .in("oauth1" / "finish")
        .in(jsonBody[OAuth1TempCred])
        .out(jsonBody[CurrentUser])
  }

  object Password {
    case class EmailSignUpRequest(
        email: String,
        initialPassword: String,
        initialProfile: Option[UserProfile],
    )

    val signUp: Endpoint[Unit, EmailSignUpRequest, OpenAPIConvention.ApiError, CurrentUser, Any] =
      basePath.post
        .in("password")
        .in(jsonBody[EmailSignUpRequest])
        .out(jsonBody[CurrentUser])
        .name("authnPasswordSignup")

    case class EmailLoginRequest(email: String, password: String)

    val login: Endpoint[Unit, EmailLoginRequest, OpenAPIConvention.ApiError, CurrentUser, Any] =
      basePath.post
        .in("password")
        .in(jsonBody[EmailLoginRequest])
        .out(jsonBody[CurrentUser])
        .name("authnPasswordLogin")

    case class EmailConfirmRequest(email: String, token: String)

    val confirmEmail: Endpoint[Unit, EmailConfirmRequest, OpenAPIConvention.ApiError, Unit, Any] =
      basePath.post
        .in("password")
        .in(jsonBody[EmailConfirmRequest])
        .out(jsonBody[Unit])
        .name("authnPasswordConfirmEmail")
  }

}
