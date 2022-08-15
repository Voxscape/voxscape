package io.jokester.quill

object UniqueKeyViolation {
  def unapply(e: Throwable): Option[Throwable] = {
    e match {
      case pe: org.postgresql.util.PSQLException
          if pe.getMessage
            .startsWith("ERROR: duplicate key value violates unique constraint") =>
        Some(e)

      case _ => None
    }
  }
}

object RowNotFoundViolation {

  /** handles `IllegalStateException(Expected a single result but got List())` when
    * query.delete.returing throws when removed row count was not 1
    */
  def unapply(e: Throwable): Option[Throwable] = {
    e match {

      case ise: java.lang.IllegalStateException
          if ise.getMessage == """Expected a single result but got List()""" =>
        Some(ise)
      case _ => None
    }
  }
}
