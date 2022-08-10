package io.jokester.fullstack_playground.todolist_api

import com.typesafe.scalalogging.LazyLogging

import java.time.Clock
import java.util.concurrent.atomic.{AtomicInteger, AtomicReference}
import io.jokester.scala_commons.openapi.OpenAPIConvention._
import TodoApi._

class TodoApiMemoryImpl extends TodoApiService with LazyLogging {

  private val _nextId = new AtomicInteger(0)
  private val _todos  = new AtomicReference[Map[Int, Todo]](Map.empty)
  private val clock   = Clock.systemUTC()

  override def list(): Failable[TodoList] = Right(TodoList(_todos.get.values.toSeq))

  override def create(req: CreateTodoIntent): Failable[Todo] =
    Right({
      val newItem =
        Todo(
          id = _nextId.incrementAndGet(),
          finished = false,
          title = req.title,
          desc = req.desc,
          updatedAt = clock.instant(),
        )
      _todos.getAndUpdate(todos => {
        todos.updated(newItem.id, newItem)
      })
      newItem
    })

  override def show(todoId: Int): Failable[Todo] = {
    (_todos.get().get(todoId).toRight(NotFound(s"Todo(id=$todoId) not found")))
  }

  override def update(todoId: Int, patch: Todo): Failable[Todo] = {
    var ret: Either[ApiError, Todo] = Left(NotFound(s"Todo(id=$todoId) not found"))

    _todos.getAndUpdate(todos => {
      todos
        .get(todoId)
        .map(existed => {
          val merged =
            existed.copy(
              title = patch.title,
              desc = patch.desc,
              finished = patch.finished,
              updatedAt = clock.instant(),
            )
          ret = Right(merged)
          todos.updated(todoId, merged)
        })
        .getOrElse(todos)
    })

    ret
  }

  def remove(todoId: Int): Failable[Unit] = {
    var found: Either[ApiError, Unit] = Left(NotFound(s"Todo(id=$todoId) not found"))

    _todos.getAndUpdate(todos => {
      todos
        .get(todoId) match {
        case Some(existed) =>
          found = Right(existed)
          todos - todoId
        case _ =>
          todos
      }
    })

    found
  }
}
