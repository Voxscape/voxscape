package io.jokester.nuthatch.base

import cats.effect.IO
import cats.effect.kernel.Resource
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import org.http4s.Query
import redis.clients.jedis.Jedis
import twitter4j.{Twitter, TwitterFactory}

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

  private val quillResources: (AutoCloseable, QuillFactory.PublicCtx) =
    QuillFactory.unsafeCreatePooledQuill(postgresConfig)

  override val quill: QuillFactory.PublicCtx = quillResources._2

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

  val quill: QuillFactory.PublicCtx

  def web: WebConfig

  def redis: Resource[IO, Jedis]

  def close(): IO[Unit]
}

/** external service
  */
private[base] trait Providers {
  protected def rootConfig: Config

  val mailer: Mailer = DummyMailer

  trait TwitterProvider {
    def oauth1Config: Config = rootConfig.getConfig("twitter_oauth1")

    def twitterFactory: Resource[IO, TwitterFactory] = {
      import twitter4j.conf.ConfigurationBuilder

      Resource.pure({
        new TwitterFactory(
          new ConfigurationBuilder()
            .setOAuthConsumerKey(oauth1Config.getString("consumer_key"))
            .setOAuthConsumerSecret(oauth1Config.getString("consumer_secret"))
            .build(),
        )
      })
    }

    def twitterClient(accessToken: String, accessTokenSecret: String): Resource[IO, Twitter] = {
      import twitter4j.auth.AccessToken
      twitterFactory.map(_.getInstance(new AccessToken(accessToken, accessTokenSecret)))
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
