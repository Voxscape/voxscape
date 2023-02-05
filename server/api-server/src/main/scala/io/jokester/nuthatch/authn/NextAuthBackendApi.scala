package io.jokester.nuthatch.authn
import io.circe.Json
import io.circe.generic.auto._
import sttp.tapir._
import sttp.tapir.generic.auto._
import sttp.tapir.json.circe.jsonBody
import java.time.OffsetDateTime
import io.jokester.api.OpenAPIConvention

/** @see
  *   https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/adapters.ts
  */
object Adapter {
  case class AdapterUser(
      id: String,
      email: String,
      name: Option[String],
      image: Option[String],
      emailVerified: Option[OffsetDateTime],
  )

  case class CreateUserRequest(
      name: Option[String],
      email: Option[String],
      image: Option[String],
      emailVerified: Option[OffsetDateTime],
  )

  case class GetUserRequest(id: String)
  case class GetUserByEmailRequest(email: String)
  case class GetUserByAccountRequest(provider: String, providerAccountId: String)

  case class AdapterAccount(
      userId: String,
      provider: String,
      providerAccountId: String,
      // was 'type' in nextauth
      accountType: String,
  )

  case class Session(
      sessionToken: String,
      userId: String,
      expires: OffsetDateTime,
  )

  // FIXME: what to do with this?
  type SecurityInput = Any

  case class ApiAuth(bearerToken: String)

  case class CreateSessionRequest(
      sessionToken: String,
      userId: String,
      expires: OffsetDateTime,
  )

  case class GetSessionRequest(sessionToken: String)
  case class SessionAndUser(session: Session, user: AdapterUser)

  case class UpdateSessionRequest(
      sessionToken: String,
      userId: Option[String],
      expires: Option[OffsetDateTime],
  )

  case class AdapterApi(rootPath: Endpoint[SecurityInput, Unit, Unit, Unit, Any]) {
    // see https://next-auth.js.org/tutorials/creating-a-database-adapter

    private def basePath: Endpoint[SecurityInput, Unit, OpenAPIConvention.ApiError, Unit, Any] = {
      rootPath
        .errorOut(
          OpenAPIConvention.defaultErrorOutputMapping,
        )
    }

    def createUser: Endpoint[
      SecurityInput,
      CreateUserRequest,
      OpenAPIConvention.ApiError,
      AdapterUser,
      Any,
    ] = {
      basePath.post.in("createUser").in(jsonBody[CreateUserRequest]).out(jsonBody[AdapterUser])
    }

    def getUser
        : Endpoint[SecurityInput, GetUserRequest, OpenAPIConvention.ApiError, AdapterUser, Any] = {
      basePath.post.in("getUser").in(jsonBody[GetUserRequest]).out(jsonBody[AdapterUser])
    }

    def getUserByEmail: Endpoint[
      SecurityInput,
      GetUserByEmailRequest,
      OpenAPIConvention.ApiError,
      AdapterUser,
      Any,
    ] = {
      basePath.post
        .in("getUserByEmail")
        .in(jsonBody[GetUserByEmailRequest])
        .out(jsonBody[AdapterUser])
    }
    def getUserByAccount: Endpoint[
      SecurityInput,
      GetUserByAccountRequest,
      OpenAPIConvention.ApiError,
      AdapterUser,
      Any,
    ] = {
      basePath.post
        .in("getUserByAccount")
        .in(jsonBody[GetUserByAccountRequest])
        .out(jsonBody[AdapterUser])
    }

    def updateUser
        : Endpoint[SecurityInput, AdapterUser, OpenAPIConvention.ApiError, AdapterUser, Any] = {
      basePath.post.in("updateUser").in(jsonBody[AdapterUser]).out(jsonBody[AdapterUser])
    }

    def linkAccount: Endpoint[
      SecurityInput,
      AdapterAccount,
      OpenAPIConvention.ApiError,
      AdapterAccount,
      Any,
    ] = {
      basePath.post.in("linkAccount").in(jsonBody[AdapterAccount]).out(jsonBody[AdapterAccount])
    }

    def createSession: Endpoint[
      SecurityInput,
      CreateSessionRequest,
      OpenAPIConvention.ApiError,
      Session,
      Any,
    ] = {
      basePath.post.in("createSession").in(jsonBody[CreateSessionRequest]).out(jsonBody[Session])
    }

    def getSessionAndUser: Endpoint[
      SecurityInput,
      GetSessionRequest,
      OpenAPIConvention.ApiError,
      SessionAndUser,
      Any,
    ] = {
      basePath.post
        .in("getSessionAndUser")
        .in(jsonBody[GetSessionRequest])
        .out(jsonBody[SessionAndUser])
    }

    def updateSession: Endpoint[
      SecurityInput,
      UpdateSessionRequest,
      OpenAPIConvention.ApiError,
      Session,
      Any,
    ] = {
      basePath.post
        .in("updateSession")
        .in(jsonBody[UpdateSessionRequest])
        .out(jsonBody[Session])
    }

    def deleteSession: Endpoint[
      SecurityInput,
      UpdateSessionRequest,
      OpenAPIConvention.ApiError,
      Session,
      Any,
    ] = {
      basePath.post.in("deleteSession").in(jsonBody[UpdateSessionRequest]).out(jsonBody[Session])
    }
  }

}
