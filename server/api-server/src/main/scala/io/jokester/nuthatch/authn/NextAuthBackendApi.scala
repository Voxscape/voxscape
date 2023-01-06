package io.jokester.nuthatch.authn
import io.circe.Json
import io.circe.generic.auto._
import sttp.tapir._
import sttp.tapir.generic.auto._
import sttp.tapir.json.circe.jsonBody
import java.time.OffsetTime
import java.time.OffsetDateTime

    /**
     * see next-auth/adapters.d.ts
     */
object Adapter {
    case class User (
        id: String,
        name: Option[String],
        email: Option[String],
        image: Option[String],
        emailVerified: Option[OffsetDateTime]

    ) 

    case class CreateUserRequest(
        id: String,
        name: Option[String],
        email: Option[String],
        image: Option[String],
    ) 


    case class Session(
        sessionToken: String,
    userId: String,
    expires: OffsetDateTime

    )

case class AdapterApi(
    basePath: PublicEndpoint[Unit, Unit, Unit, Any]
) {
    // see https://next-auth.js.org/tutorials/creating-a-database-adapter

    def createUser = basePath.post.in("createUser").in(jsonBody[CreateUserRequest]).out(jsonBody[User])


}

}


case class NextAuthVerificationTokenApi(
    basePath: PublicEndpoint[Unit, Unit, Unit, Any]
) {

}