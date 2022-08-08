package io.jokester.fullstack_playground.todolist_api

import org.scalatest.flatspec.AnyFlatSpec

class MemoryImplTest extends AnyFlatSpec with TodoApiImplTest {

  override val testee = new TodoApiMemoryImpl

}
