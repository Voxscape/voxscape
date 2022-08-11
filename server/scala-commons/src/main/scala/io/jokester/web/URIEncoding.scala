package io.jokester.web
import akka.http.scaladsl.model.Uri.Query
import com.google.common.net.UrlEscapers

object URIEncoding {
  /**
   * @note NOT exactly same behavior with JS version
   */
  def encodeURIComponent(orig: String): String = {
    val escaper = UrlEscapers.urlFormParameterEscaper()
    escaper.escape(orig)
  }

  /**
   * @note NOT exactly same behavior with JS version
   */
  def decodeURIComponent(encoded: String): String = {
    val q = Query(s"_=$encoded")
    q.get("_").get
  }

}
