package io.jokester.fullstack_playground.todolist_api

import com.typesafe.scalalogging.LazyLogging
import cats.syntax.either._
import io.jokester.fullstack_playground.quill.generated.public.Todos
import io.jokester.fullstack_playground.quill.{QuillContextFactory, QuillWorkarounds}
import io.jokester.fullstack_playground.todolist_api.TodoApi.{CreateTodoIntent, TodoList}
import io.jokester.api.OpenAPIConvention._
import io.jokester.quill.QuillDatetimeEncoding

import java.time.{Clock, OffsetDateTime}

class TodoApiQuillImpl(
    protected override val ctx: QuillContextFactory.PublicCtx,
) extends TodoApiService
    with QuillWorkarounds
    with LazyLogging
    with QuillDatetimeEncoding[QuillContextFactory.PublicCtx] {
  import ctx._

  override def create(req: CreateTodoIntent): Failable[TodoApi.Todo] = {
    val created = ctx.run(quote {
      query[Todos]
        .insert(_.title -> lift(req.title), _.desc -> lift(req.desc))
        .returning(row => row)
    })
    (mapFromDB(created)).asRight
  }

  override def list(): Failable[TodoList] = {
    val q = quote { query[Todos] }
    val r = ctx.run(q).map(mapFromDB)
    TodoList(r).asRight
  }

  override def show(todoId: Int): Failable[TodoApi.Todo] = {
    val found = run(quote {
      query[Todos].filter(_.todoId == lift(todoId))
    })
    found.headOption.map(mapFromDB) match {
      case Some(got) => got.asRight
      case _         => NotFound(s"Todo(id=$todoId) not found").asLeft
    }
  }

  override def update(todoId: Int, patch: TodoApi.Todo): Failable[TodoApi.Todo] = {
    transaction {

      val existed: Option[Todos] = run(findById(todoId)).headOption

      existed match {
        case Some(found) =>
          val merged = found.copy(
            title = patch.title,
            desc = patch.desc,
            finishedAt = found.finishedAt match {
              case None if patch.finished     => Some(now)
              case Some(_) if !patch.finished => None
              case _                          => found.finishedAt
            },
          )
          logger.debug("updating {} with {}", existed, merged)

          val updated = run {

            findById(todoId)
              .update(
                _.title      -> lift(merged.title),
                _.desc       -> lift(merged.desc),
                _.finishedAt -> lift(merged.finishedAt: Option[OffsetDateTime]),
//                lift(merged),
              )
              .returning(row => row)
          }
          mapFromDB(updated).asRight
        case _ => NotFound(s"Todo(id=$todoId) not found").asLeft

      }
    }

  }

  override def remove(todoId: Int): Failable[Unit] = {

    try {

      /**
        * @note delete.returning() throws when the query returns NO or MULTI rows
        */
      val removed = run { findById(todoId).delete.returning(row => row) }
      logger.debug("remove returned {}", removed)

      ().asRight

    } catch {
      case RowNotFoundViolation(_) =>
        NotFound(s"Todo(id=$todoId) not found").asLeft
    }
  }

  private def findById(todoId: Int) = quote(query[Todos].filter(_.todoId == lift(todoId)))

  private def mapFromDB(row: Todos): TodoApi.Todo = {
    TodoApi.Todo(
      id = row.todoId,
      title = row.title,
      desc = row.desc,
      finished = row.finishedAt.isDefined,
      updatedAt = row.updatedAt.toInstant,
    )
  }

  private val clock = Clock.systemUTC()
  private def now   = OffsetDateTime.now(clock)

  /**
    * @note updateMeta for some reason doesn't work
    * this WAS SUPPOSED TO allows us to lift(todo_value) , and exclude todoId columns in update
    *
    * @see https://getquill.io/#extending-quill-meta-dsl-update-meta
    */
//  private implicit val todoUpdateMeta: UpdateMeta[Todos] =
//    updateMeta[Todos](_.todoId, _.updatedAt, _.createdAt)
}
