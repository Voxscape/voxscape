package io.jokester.utils.security
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

trait BCryptHelpers {

  private lazy val bcrypt = new BCryptPasswordEncoder

  def createPasswordHash(pass: String): String = bcrypt.encode(pass)

  def validatePassword(pass: String, passwordHash: String): Boolean =
    bcrypt.matches(pass, passwordHash)

}
