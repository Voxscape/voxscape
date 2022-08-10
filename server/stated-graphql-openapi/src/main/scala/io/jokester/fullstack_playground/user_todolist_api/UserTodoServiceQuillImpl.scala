package io.jokester.fullstack_playground.user_todolist_api
import cats.syntax.either._
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._
import io.circe.syntax._
import io.jokester.fullstack_playground.quill.generated.userTodo.{
  UserTodos => UserTodoRow,
  Users => UserRow,
}
import io.jokester.fullstack_playground.quill.{QuillContextFactory, QuillWorkarounds}
import io.jokester.fullstack_playground.user_todolist_api.UserTodoApi._
import io.jokester.api.JwtAuthConvention._
import io.jokester.api.OpenAPIConvention._
import io.jokester.scala_commons.quill.{QuillCirceJsonEncoding, QuillDatetimeEncoding}
import io.jokester.utils.security.BCryptHelpers

import scala.util.chaining._

class UserTodoServiceQuillImpl(protected override val ctx: QuillContextFactory.UserTodoCtx)
    extends UserTodoService
    with QuillDatetimeEncoding[QuillContextFactory.UserTodoCtx]
    with QuillCirceJsonEncoding[QuillContextFactory.UserTodoCtx]
    with BCryptHelpers
    with QuillWorkarounds
    with LazyLogging {
  import ctx._
  import UserTodoSchema._

  override def createUser(
      req: UserTodoApi.CreateUserRequest,
  ): Failable[UserTodoApi.UserAccount] = {

    try {

      val created: UserRow = run(quote {
        UsersDao.query
          .insert(
            _.email        -> lift(req.email.toLowerCase),
            _.passwordHash -> lift(createPasswordHash(req.initialPass)),
            _.profile      -> lift(req.profile.asJson),
          )
          .returning(row => row)
      })
      fromRow(created).asRight
    } catch {
      case UniqueKeyViolation(_) =>
        BadRequest(s"Email address ${req.email} already occupied").asLeft
    }

  }

  override def updateProfile(
      userId: UserId,
      newProfile: UserTodoApi.UserProfile,
  ): Failable[UserTodoApi.UserAccount] = {
    val updated = run({

      UsersDao.query
        .filter(u => u.userId == lift(userId.value))
        .update(_.profile -> lift(newProfile.asJson))
    })
    if (!(updated == 1)) {
      BadRequest("user not found").asLeft
    } else {
      showUser(userId)
    }
  }

  override def showUser(
      userId: UserId,
  ): Failable[UserTodoApi.UserAccount] = {
    val found: Option[UserAccount] = run({
      UsersDao.query.filter(u => u.userId == lift(userId.value))
    }).headOption.map(fromRow)

    found match {
      case Some(user) => user.asRight
      case _          => BadRequest("user not found").asLeft
    }
  }

  override def loginUser(
      req: UserTodoApi.LoginRequest,
  ): Failable[UserTodoApi.UserAccount] = {
    val loaded = run(quote {
      UsersDao.query.filter(row => row.email == lift(req.email))
    })
    loaded.headOption
      .filter(f => validatePassword(req.password, f.passwordHash))
      .map(fromRow) match {
      case Some(user) => user.asRight
      case _          => BadRequest("invalid cred").asLeft
    }
  }

  override def createTodo(
      userId: UserId,
      req: UserTodoApi.CreateTodoRequest,
  ): Failable[UserTodoApi.CreateTodoResponse] = {
    val created: UserTodoRow = run(quote {
      UserTodosDao.query
        .insert(
          _.userId      -> lift(userId.value),
          _.title       -> lift(req.title),
          _.description -> lift(req.description),
          _.finishedAt  -> None,
        )
        .returning(row => row)
    })

    created
      .pipe(fromRow)
      .asRight
  }

  override def listTodo(
      userId: UserId,
  ): Failable[UserTodoApi.TodoList] = {
    val found = run(quote {
      UserTodosDao.query.filter(_.userId == lift(userId.value))
    })

    TodoList(found.map(fromRow)).asRight
  }

  override def updateTodo(
      userId: UserId,
      req: UserTodoApi.TodoItem,
  ): Failable[UserTodoApi.TodoItem] = {
    val found = run(findTodo(userId, req.todoId)).headOption.map(fromRow)

    val merged = found.map(existed => {
      existed.copy(title = req.title, description = req.description, finishedAt = req.finishedAt)
    })

    val updated = merged
      .map(m =>
        run(quote({
          findTodo(userId, req.todoId)
            .update(
              _.title       -> lift(m.title),
              _.description -> lift(m.description),
              _.finishedAt  -> lift(m.finishedAt),
            )
            .returning(row => row)

        })),
      )
      .map(v => v.pipe(fromRow))

    updated match {
      case Some(v) => v.asRight
      case None    => BadRequest("not found").asLeft
    }

  }

  override def deleteTodo(
      userId: UserId,
      todoId: Int,
  ): Failable[UserTodoApi.TodoItem] = {
    try {
      val removed = run {
        findTodo(userId, todoId).delete.returning(row => row)
      }
      removed.pipe(fromRow).asRight
    } catch {
      case RowNotFoundViolation(_) => BadRequest("not found").asLeft
    }
  }

  private def findTodo(userId: UserId, todoId: Int) =
    quote {
      UserTodosDao.query.filter(row =>
        row.userId == lift(userId.value) && row.todoId == lift(todoId),
      )
    }

  private def fromRow(row: UserRow): UserAccount = {
    UserAccount(
      userId = row.userId,
      profile = row.profile.as[UserProfile].getOrElse(UserProfile(None, None)),
    )
  }

  private def fromRow(row: UserTodoRow): UserTodoApi.TodoItem = {
    UserTodoApi.TodoItem(
      todoId = row.todoId,
      userId = row.userId,
      finishedAt = row.finishedAt,
      title = row.title,
      description = row.description,
    )

  }
}
