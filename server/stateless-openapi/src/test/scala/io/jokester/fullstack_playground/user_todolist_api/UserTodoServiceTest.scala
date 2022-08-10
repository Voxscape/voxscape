package io.jokester.fullstack_playground.user_todolist_api

import com.github.javafaker.Faker
import io.jokester.fullstack_playground.user_todolist_api.UserTodoApi._
import io.jokester.http_api.FailableValues
import io.jokester.api.JwtAuthConvention.UserId
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should
import org.scalatest.{EitherValues, OptionValues}

import java.time.OffsetDateTime

trait UserTodoServiceTest
    extends should.Matchers
    with EitherValues
    with OptionValues
    with ScalaFutures
    with FailableValues {
  self: AnyFlatSpec =>

  private val faker = new Faker

  def testee: UserTodoService

  "testee" should "create and auth users" in {

    val createUserRequest = UserTodoApi.CreateUserRequest(
      email = faker.internet().emailAddress(),
      initialPass = faker.internet().password(),
      profile = UserProfile(
        nickname = Some(faker.chuckNorris().fact()),
        avatarUrl = Some(faker.internet().image()),
      ),
    )
    val newUser1 = testee
      .createUser(
        createUserRequest,
      )
      .right
      .value

    newUser1 shouldBe a[UserAccount]

    {
      val reloadedUser = testee.showUser(UserId(newUser1.userId)).right.value
      reloadedUser should equal(newUser1)
    }

    {
      val loginSuccess = testee.loginUser(
        LoginRequest(email = createUserRequest.email, password = createUserRequest.initialPass),
      )

      loginSuccess.right.value shouldBe a[UserAccount]
      loginSuccess.right.value.profile.nickname.get should equal(
        createUserRequest.profile.nickname.get,
      )
      loginSuccess.right.value.profile.avatarUrl should equal(createUserRequest.profile.avatarUrl)
    }

    {
      val passwordMismatch = testee.loginUser(
        LoginRequest(email = createUserRequest.email, password = faker.internet().password()),
      )
      passwordMismatch.left.value should equal(BadRequest("invalid cred"))
    }

    {
      val userNotFound = testee.loginUser(
        LoginRequest(
          email = faker.internet().emailAddress(),
          password = createUserRequest.initialPass,
        ),
      )
      userNotFound.left.value should equal(BadRequest("invalid cred"))
    }

    {
      val userDuplicated = testee.createUser(createUserRequest)

      userDuplicated.left.value should equal(
        BadRequest(s"Email address ${createUserRequest.email} already occupied"),
      )
    }

  }

  "testee" should "update user profile" in {
    val createUserRequest = UserTodoApi.CreateUserRequest(
      email = faker.internet().emailAddress(),
      initialPass = faker.internet().password(),
      profile = UserProfile(None, None),
    )

    val profile2 = UserProfile(
      nickname = Some(faker.chuckNorris().fact()),
      avatarUrl = Some(faker.internet().image()),
    )

    val created = testee.createUser(createUserRequest).right.value

    created.profile should equal(createUserRequest.profile)

    val updated = testee.updateProfile(UserId(created.userId), profile2).right.value
    updated.profile should equal(profile2)
  }

  "testee" should "CRUD todos for user" in {
    val createUserRequest = UserTodoApi.CreateUserRequest(
      email = faker.internet().emailAddress(),
      initialPass = faker.internet().password(),
      profile = UserProfile(None, None),
    )

    val uid1 = UserId(testee.createUser(createUserRequest).right.value.userId)

    {
      val todos1 = testee.listTodo(uid1)
      todos1.right.value.items should equal(Seq.empty)
    }

    val created1 = testee
      .createTodo(
        uid1,
        CreateTodoRequest(
          title = faker.lordOfTheRings().location(),
          description = faker.hitchhikersGuideToTheGalaxy().marvinQuote(),
        ),
      )
      .right
      .value
    created1 shouldBe a[TodoItem]

    val updated = testee
      .updateTodo(
        uid1,
        created1.copy(
          title = faker.hitchhikersGuideToTheGalaxy().location(),
          finishedAt = Some(OffsetDateTime.now()),
        ),
      )
      .right
      .value
    updated.title should not equal (created1.title)
    updated.description should equal(created1.description)
    updated.finishedAt shouldBe a[Some[_]]

    {
      val l = testee.listTodo(uid1).right.value
      l.items should equal(Seq(updated))
    }

    {
      val uid2 = UserId(
        testee
          .createUser(createUserRequest.copy(email = faker.internet().emailAddress()))
          .right
          .value
          .userId,
      )

      val updateWhenUserMismatch = testee.updateTodo(uid2, created1)
      updateWhenUserMismatch.left.value should equal(BadRequest("not found"))
    }

    {
      val deleted = testee.deleteTodo(uid1, created1.todoId)
      deleted.right.value should equal(updated)
    }

    {
      val l = testee.listTodo(uid1).right.value
      l.items should equal(Seq.empty)
    }

    {
      val removeWhenAbsent = testee.deleteTodo(uid1, created1.todoId)
      removeWhenAbsent.left.value should equal(BadRequest("not found"))
    }

  }

}
