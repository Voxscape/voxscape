package io.jokester.api

import cats.syntax.either._
import io.circe._
import io.circe.generic.auto._
import io.circe.syntax._
import io.jokester.api.OpenAPIConvention
import pdi.jwt.{JwtAlgorithm, JwtCirce, JwtClaim}

import java.time.Instant
import scala.util.{Success, Try}
import io.jokester.api.OpenAPIConvention._

object JwtAuthConvention {

  /** token from request
    */
  final case class TaintedToken(value: String) extends AnyVal

  /** validated userId
    */
  case class UserId(value: Int)
}

trait JwtAuthConvention extends JwtHelper {
  import JwtAuthConvention._
  private def now(): Long = Instant.now().getEpochSecond

  /** payload to encode into JWT
    */
  final case class BearerTokenPayload(
      userId: Int,
      tokenType: String,
  ) {
    def assertTokenType(expected: String): Failable[BearerTokenPayload] = {
      if (tokenType == expected) this.asRight
      else OpenAPIConvention.BadRequest("invalid token type").asLeft
    }

    def assertUserId(expectedUserId: Int): Failable[UserId] =
      if (userId == expectedUserId) UserId(userId).asRight
      else OpenAPIConvention.BadRequest("invalid userId").asLeft
  }

  case class RefreshTokenPayload(userId: Int, tokenType: String)

  def decodeAccessToken(t: TaintedToken): Failable[BearerTokenPayload] = {
    decodeBearerToken(t)
      .filterOrElse(_.tokenType == "accessToken", BadRequest("invalid token type"))
  }

  def decodeBearerToken(t: TaintedToken): Failable[BearerTokenPayload] =
    decodeToken[BearerTokenPayload](t.value) match {
      case Success(value)
          if value.tokenType == "accessToken" || value.tokenType == "refreshToken" =>
        value.asRight
      case _ => Unauthorized("Invalid jwt token").asLeft
    }

  def signAccessToken(userId: Int): String = {
    signToken(
      BearerTokenPayload(userId, tokenType = "accessToken"),
      expiresIn = 3600,
      issueAt = now(),
    )
  }

  def signAccessToken(userId: Int, hasuraClaims: HasuraJwtAuthConvention.HasuraClaims): String = {
    val fullPayload = JsonObject(
      "https://hasura.io/jwt/claims" -> hasuraClaims.asJsonObject.asJson,
    ).deepMerge(BearerTokenPayload(userId = userId, tokenType = "accessToken").asJsonObject)

    signToken(fullPayload, expiresIn = 3600, issueAt = now())
  }

  def signRefreshToken(userId: Int): String =
    signToken(
      BearerTokenPayload(userId = userId, tokenType = "refreshToken"),
      expiresIn = 3600 * 24 * 7,
      issueAt = now(),
    )

  def validateAccessToken(
      tokenPayload: BearerTokenPayload,
      expectedUserId: Int,
      expectedTokenType: String = "accessToken",
  ): Failable[UserId] = {
    tokenPayload
      .assertTokenType(expectedTokenType)
      .flatMap(_.assertUserId(expectedUserId))
  }

  /** @deprecated
    */
  def validateAccessToken(
      token: TaintedToken,
      expectedUserId: Int,
  ): Failable[UserId] = {
    for (
      t <- decodeBearerToken(token);
      u <- validateAccessToken(t, expectedUserId)
    ) yield u
  }
}

protected trait JwtHelper {
  def jwtSecret: String

  protected def signToken[T: Encoder](
      payload: T,
      expiresIn: Int,
      issueAt: Long,
  ): String = {
    signToken(payload.asJson, expiresIn, issueAt)
  }

  protected def signToken(
      payload: Json,
      expiresIn: Int,
      issueAt: Long,
  ): String = {
    val claim = JwtClaim(
      content = payload.asJson.noSpaces,
      issuedAt = Some(issueAt),
      expiration = Some(issueAt + expiresIn),
      notBefore = Some(issueAt),
    )

    JwtCirce.encode(claim, jwtSecret, JwtAlgorithm.HS256)
  }

  protected def decodeToken[T: Decoder](token: String): Try[T] = {
    val decoder = implicitly[Decoder[T]]
    for (
      claim          <- JwtCirce.decode(token, jwtSecret, Seq(JwtAlgorithm.HS256));
      payload        <- parser.parse(claim.content).toTry;
      decodedPayload <- decoder.decodeJson(payload).toTry
    ) yield decodedPayload
  }
}
