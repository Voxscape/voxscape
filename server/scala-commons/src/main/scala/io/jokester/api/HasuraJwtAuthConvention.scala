package io.jokester.api

import io.circe.JsonObject
import io.circe.syntax.EncoderOps

object HasuraJwtAuthConvention {

  /** @see
    *   https://hasura.io/docs/latest/auth/authentication/jwt/#the-spec
    * @return
    */
  final case class HasuraClaims(
      userId: Int,
      defaultRole: String = "user",
      hasuraRoles: Seq[String] = Seq("user"),
  ) {
    def asJsonObject: JsonObject =
      JsonObject(
        "x-hasura-default-role"  -> defaultRole.asJson,
        "x-hasura-user-id"       -> userId.toString.asJson,
        "x-hasura-allowed-roles" -> hasuraRoles.asJson,
      )
  }
}
