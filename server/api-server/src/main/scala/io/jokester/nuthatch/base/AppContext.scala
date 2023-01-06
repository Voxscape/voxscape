package io.jokester.nuthatch.base

import cats.effect.IO
import cats.effect.kernel.Resource
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import org.http4s.Query
import redis.clients.jedis.Jedis
import twitter4j.{OAuth2Authorization, OAuth2Token, Twitter}

import scala.util.{Failure, Try}

object AppContext {
  def buildDefault($rootConfig: Config): AppContext = new AppContext($rootConfig)

}

/** dependency root of all other services
  */
class AppContext(val rootConfig: Config) extends AppContextBase with LazyLogging {

  protected def redisConfig: Config = rootConfig.getConfig("redis")

  private def postgresConfig: Config = rootConfig.getConfig("postgres")

  override val redis: Resource[IO, Jedis] =
    RedisFactory.wrapJedisPool(RedisFactory.poolFromConfig(redisConfig))

  private val quillResources: (AutoCloseable, QuillFactory.RdbContext) =
    QuillFactory.unsafeCreatePooledQuill(postgresConfig)

  override val quill: QuillFactory.RdbContext = quillResources._2

  override val providers = new Providers {
    protected override val rootConfig: Config = AppContext.this.rootConfig

    override def twitter: TwitterProvider = new TwitterProvider {}
  }

  object web extends WebConfig {
    protected override val siteConfig: Config = AppContext.this.rootConfig.getConfig("site")
  }

  def unsafeClose(): Unit = {
    Try {
      logger.debug("closing Jedis pool")

      /** FIXME: this causes a strange "Invalidated object not currently part of this pool" error
        */
      quillResources._1.close()
    } match {
      case Failure(exception) => logger.warn("error closing Jedis pool", exception)
      case _                  =>
    }
  }

  override def close(): IO[Unit] = IO {
    unsafeClose()
  }
}

trait AppContextBase extends RedisKeys {
  protected def redisConfig: Config

  def providers: Providers

  val quill: QuillFactory.RdbContext

  def web: WebConfig

  def redis: Resource[IO, Jedis]

  def close(): IO[Unit]
}

/** external service
  */
private[base] trait Providers {
  protected def rootConfig: Config

  val mailer: Mailer = DummyMailer

  protected trait TwitterProvider {
    def config: Config = rootConfig.getConfig("twitter")

    def fetchAppOAuth2Token: IO[OAuth2Token] = {
      val auth = OAuth2Authorization.getInstance(
        config.getConfig("oauth1").getString("consumer_key"),
        config.getConfig("oauth1").getString("consumer_secret"),
      )
      IO(auth.getOAuth2Token)
    }

    def buildAppAuthedClient(): Twitter = {
      Twitter
        .newBuilder()
        .applicationOnlyAuthEnabled(true)
        .oAuthConsumer(
          config.getConfig("oauth1").getString("consumer_key"),
          config.getConfig("oauth1").getString("consumer_secret"),
        )
        .oAuth2Token("bearer", config.getConfig("oauth2").getString("bearer_token"))
        .build()
    }

    /** user-authed twitter client
      */
    def buildOAuth1AuthClient(oauthAccessToken: String, oAuthTokenSecret: String): Twitter = {
      Twitter
        .newBuilder()
        .oAuthConsumer(
          config.getConfig("oauth1").getString("consumer_key"),
          config.getConfig("oauth1").getString("consumer_secret"),
        )
        .oAuthAccessToken(oauthAccessToken, oAuthTokenSecret)
        .build()
    }

  }

  def twitter: TwitterProvider
}

/** web stuff
  */
private[base] trait WebConfig {
  protected def siteConfig: Config

  private def createUrl(afterOrigin: String): String = {
    siteConfig.getString("origin") + afterOrigin
  }

  def userActivationPage(query: Query): String = createUrl(s"/user/activate?${query.renderString}")
}
