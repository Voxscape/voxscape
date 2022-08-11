package io.jokester.web
import org.scalatest.matchers.should
import org.scalatest.flatspec.AnyFlatSpec

class URIEncodingTest extends AnyFlatSpec with should.Matchers {
  "URIEncoding" should "encode uri components" in {
    val map = Map(
      "+ &?"      -> "%2B+%26%3F",
      "()"        -> "%28%29",
      "/:http://" -> ("%2F%3Ahttp%3A%2F%2F"),
      "шеллы"     -> "%D1%88%D0%B5%D0%BB%D0%BB%D1%8B",
    )

    map.foreachEntry((k: String, v: String) => {

      URIEncoding.encodeURIComponent(k) should equal(v)
      URIEncoding.decodeURIComponent(URIEncoding.encodeURIComponent(k)) should equal(k)
    })

  }
}
