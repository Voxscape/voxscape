package io.jokester.fullstack_playground.quill.generated.public

case class Todos(todoId: Int, title: String, desc: String, finishedAt: Option[java.time.OffsetDateTime], createdAt: java.time.OffsetDateTime, updatedAt: java.time.OffsetDateTime)

trait PublicExtensions[Idiom <: io.getquill.idiom.Idiom, Naming <: io.getquill.NamingStrategy] {
  this:io.getquill.context.Context[Idiom, Naming] =>

  object PublicSchema {
    object TodosDao {
        def query = quote {
            querySchema[Todos](
              "public.todos",
              _.todoId -> "todo_id",
              _.title -> "title",
              _.desc -> "desc",
              _.finishedAt -> "finished_at",
              _.createdAt -> "created_at",
              _.updatedAt -> "updated_at"
            )
                      
          }
                    
      }
  }
}
