package io.jokester.nuthatch.scopes.user

object UserApi {

  case class OAuth1TempCred(oauthToken: String, oauthVerifier: String)

}
