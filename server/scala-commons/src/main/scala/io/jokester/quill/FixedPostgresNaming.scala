package io.jokester.quill

import io.getquill.SnakeCase

object FixedPostgresNaming extends SnakeCase {
  final override def table(s: String): String  = s"""\"${super.table(s)}\""""
  final override def column(s: String): String = s"""\"${super.column(s)}\""""
}
