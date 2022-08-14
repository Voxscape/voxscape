package io.jokester.web
import com.google.common.net.UrlEscapers
import org.http4s.Query

object URIEncoding {

  /** @note
    *   NOT exactly same behavior with JS version
    */
  def encodeURIComponent(orig: String): String = {
    val escaper = UrlEscapers.urlFormParameterEscaper()
    escaper.escape(orig)
  }

  /** @note
    *   NOT exactly same behavior with JS version
    */
  def decodeURIComponent(encoded: String): String = {
    val q = Query("_" -> Some(encoded))
    q.toString.slice(2, 100000)
  }

}
