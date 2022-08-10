package io.jokester.fullstack_playground.todolist_api

import io.jokester.api.OpenAPIConvention.Failable

trait TodoApiService {
  import TodoApi._

  def create(req: CreateTodoIntent): Failable[Todo]

  def list(): Failable[TodoList]

  def show(todoId: Int): Failable[Todo]

  def update(todoId: Int, patch: Todo): Failable[Todo]

  def remove(todoId: Int): Failable[Unit]
}
