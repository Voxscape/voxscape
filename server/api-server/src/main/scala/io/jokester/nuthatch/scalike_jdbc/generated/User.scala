package io.jokester.nuthatch.scalike_jdbc.generated

import scalikejdbc._
import java.time.{OffsetDateTime}

case class User(
  userId: Int,
  email: String,
  username: String,
  isActivated: Boolean,
  createdAt: OffsetDateTime,
  updatedAt: OffsetDateTime) {

  def save()(implicit session: DBSession): User = User.save(this)(session)

  def destroy()(implicit session: DBSession): Int = User.destroy(this)(session)

}


object User extends SQLSyntaxSupport[User] {

  override val schemaName = Some("public")

  override val tableName = "user"

  override val columns = Seq("user_id", "email", "username", "is_activated", "created_at", "updated_at")

  def apply(u: SyntaxProvider[User])(rs: WrappedResultSet): User = apply(u.resultName)(rs)
  def apply(u: ResultName[User])(rs: WrappedResultSet): User = new User(
    userId = rs.get(u.userId),
    email = rs.get(u.email),
    username = rs.get(u.username),
    isActivated = rs.get(u.isActivated),
    createdAt = rs.get(u.createdAt),
    updatedAt = rs.get(u.updatedAt)
  )

  val u = User.syntax("u")

  override val autoSession = AutoSession

  def find(userId: Int)(implicit session: DBSession): Option[User] = {
    sql"""select ${u.result.*} from ${User as u} where ${u.userId} = ${userId}"""
      .map(User(u.resultName)).single.apply()
  }

  def findAll()(implicit session: DBSession): List[User] = {
    sql"""select ${u.result.*} from ${User as u}""".map(User(u.resultName)).list.apply()
  }

  def countAll()(implicit session: DBSession): Long = {
    sql"""select count(1) from ${User.table}""".map(rs => rs.long(1)).single.apply().get
  }

  def findBy(where: SQLSyntax)(implicit session: DBSession): Option[User] = {
    sql"""select ${u.result.*} from ${User as u} where ${where}"""
      .map(User(u.resultName)).single.apply()
  }

  def findAllBy(where: SQLSyntax)(implicit session: DBSession): List[User] = {
    sql"""select ${u.result.*} from ${User as u} where ${where}"""
      .map(User(u.resultName)).list.apply()
  }

  def countBy(where: SQLSyntax)(implicit session: DBSession): Long = {
    sql"""select count(1) from ${User as u} where ${where}"""
      .map(_.long(1)).single.apply().get
  }

  def create(
    email: String,
    username: String,
    isActivated: Boolean,
    createdAt: OffsetDateTime,
    updatedAt: OffsetDateTime)(implicit session: DBSession): User = {
    val generatedKey = sql"""
      insert into ${User.table} (
        ${column.email},
        ${column.username},
        ${column.isActivated},
        ${column.createdAt},
        ${column.updatedAt}
      ) values (
        ${email},
        ${username},
        ${isActivated},
        ${createdAt},
        ${updatedAt}
      )
      """.updateAndReturnGeneratedKey.apply()

    User(
      userId = generatedKey.toInt,
      email = email,
      username = username,
      isActivated = isActivated,
      createdAt = createdAt,
      updatedAt = updatedAt)
  }

  def batchInsert(entities: collection.Seq[User])(implicit session: DBSession): List[Int] = {
    val params: collection.Seq[Seq[(Symbol, Any)]] = entities.map(entity =>
      Seq(
        Symbol("email") -> entity.email,
        Symbol("username") -> entity.username,
        Symbol("isActivated") -> entity.isActivated,
        Symbol("createdAt") -> entity.createdAt,
        Symbol("updatedAt") -> entity.updatedAt))
    SQL("""insert into user(
      email,
      username,
      is_activated,
      created_at,
      updated_at
    ) values (
      {email},
      {username},
      {isActivated},
      {createdAt},
      {updatedAt}
    )""").batchByName(params.toSeq: _*).apply[List]()
  }

  def save(entity: User)(implicit session: DBSession): User = {
    sql"""
      update
        ${User.table}
      set
        ${column.userId} = ${entity.userId},
        ${column.email} = ${entity.email},
        ${column.username} = ${entity.username},
        ${column.isActivated} = ${entity.isActivated},
        ${column.createdAt} = ${entity.createdAt},
        ${column.updatedAt} = ${entity.updatedAt}
      where
        ${column.userId} = ${entity.userId}
      """.update.apply()
    entity
  }

  def destroy(entity: User)(implicit session: DBSession): Int = {
    sql"""delete from ${User.table} where ${column.userId} = ${entity.userId}""".update.apply()
  }

}
