package io.jokester.fullstack_playground.scalikejdbc.generated

import scalikejdbc._
import java.time.{OffsetDateTime}

case class Todos(
  todoId: Int,
  title: String,
  desc: String,
  finishedAt: Option[OffsetDateTime] = None,
  createdAt: OffsetDateTime,
  updatedAt: OffsetDateTime) {

  def save()(implicit session: DBSession): Todos = Todos.save(this)(session)

  def destroy()(implicit session: DBSession): Int = Todos.destroy(this)(session)

}


object Todos extends SQLSyntaxSupport[Todos] {

  override val schemaName = Some("public")

  override val tableName = "todos"

  override val columns = Seq("todo_id", "title", "desc", "finished_at", "created_at", "updated_at")

  def apply(t: SyntaxProvider[Todos])(rs: WrappedResultSet): Todos = apply(t.resultName)(rs)
  def apply(t: ResultName[Todos])(rs: WrappedResultSet): Todos = new Todos(
    todoId = rs.get(t.todoId),
    title = rs.get(t.title),
    desc = rs.get(t.desc),
    finishedAt = rs.get(t.finishedAt),
    createdAt = rs.get(t.createdAt),
    updatedAt = rs.get(t.updatedAt)
  )

  val t = Todos.syntax("t")

  override val autoSession = AutoSession

  def find(todoId: Int)(implicit session: DBSession): Option[Todos] = {
    sql"""select ${t.result.*} from ${Todos as t} where ${t.todoId} = ${todoId}"""
      .map(Todos(t.resultName)).single.apply()
  }

  def findAll()(implicit session: DBSession): List[Todos] = {
    sql"""select ${t.result.*} from ${Todos as t}""".map(Todos(t.resultName)).list.apply()
  }

  def countAll()(implicit session: DBSession): Long = {
    sql"""select count(1) from ${Todos.table}""".map(rs => rs.long(1)).single.apply().get
  }

  def findBy(where: SQLSyntax)(implicit session: DBSession): Option[Todos] = {
    sql"""select ${t.result.*} from ${Todos as t} where ${where}"""
      .map(Todos(t.resultName)).single.apply()
  }

  def findAllBy(where: SQLSyntax)(implicit session: DBSession): List[Todos] = {
    sql"""select ${t.result.*} from ${Todos as t} where ${where}"""
      .map(Todos(t.resultName)).list.apply()
  }

  def countBy(where: SQLSyntax)(implicit session: DBSession): Long = {
    sql"""select count(1) from ${Todos as t} where ${where}"""
      .map(_.long(1)).single.apply().get
  }

  def create(
    title: String,
    desc: String,
    finishedAt: Option[OffsetDateTime] = None,
    createdAt: OffsetDateTime,
    updatedAt: OffsetDateTime)(implicit session: DBSession): Todos = {
    val generatedKey = sql"""
      insert into ${Todos.table} (
        ${column.title},
        ${column.desc},
        ${column.finishedAt},
        ${column.createdAt},
        ${column.updatedAt}
      ) values (
        ${title},
        ${desc},
        ${finishedAt},
        ${createdAt},
        ${updatedAt}
      )
      """.updateAndReturnGeneratedKey.apply()

    Todos(
      todoId = generatedKey.toInt,
      title = title,
      desc = desc,
      finishedAt = finishedAt,
      createdAt = createdAt,
      updatedAt = updatedAt)
  }

  def batchInsert(entities: collection.Seq[Todos])(implicit session: DBSession): List[Int] = {
    val params: collection.Seq[Seq[(Symbol, Any)]] = entities.map(entity =>
      Seq(
        Symbol("title") -> entity.title,
        Symbol("desc") -> entity.desc,
        Symbol("finishedAt") -> entity.finishedAt,
        Symbol("createdAt") -> entity.createdAt,
        Symbol("updatedAt") -> entity.updatedAt))
    SQL("""insert into todos(
      title,
      desc,
      finished_at,
      created_at,
      updated_at
    ) values (
      {title},
      {desc},
      {finishedAt},
      {createdAt},
      {updatedAt}
    )""").batchByName(params.toSeq: _*).apply[List]()
  }

  def save(entity: Todos)(implicit session: DBSession): Todos = {
    sql"""
      update
        ${Todos.table}
      set
        ${column.todoId} = ${entity.todoId},
        ${column.title} = ${entity.title},
        ${column.desc} = ${entity.desc},
        ${column.finishedAt} = ${entity.finishedAt},
        ${column.createdAt} = ${entity.createdAt},
        ${column.updatedAt} = ${entity.updatedAt}
      where
        ${column.todoId} = ${entity.todoId}
      """.update.apply()
    entity
  }

  def destroy(entity: Todos)(implicit session: DBSession): Int = {
    sql"""delete from ${Todos.table} where ${column.todoId} = ${entity.todoId}""".update.apply()
  }

}
