package io.jokester.nuthatch.base

import cats.effect.IO
import cats.effect.kernel.Resource
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import org.http4s.Query
import redis.clients.jedis.Jedis
import twitter4j.TwitterFactory

import scala.util.{Failure, Try}

object AppContext {
  def buildDefault($rootConfig: Config): AppContext = new AppContext {
    override def rootConfig: Config = $rootConfig

    override def redisConfig: Config = rootConfig.getConfig("redis")

    override def postgresConfig: Config = rootConfig.getConfig("postgres")
  }
}

/** dependency root of all other services
  */
trait AppContext extends LazyLogging with RedisKeys {
  def rootConfig: Config

  protected def redisConfig: Config

  protected def postgresConfig: Config

  private val jedisPool = RedisFactory.poolFromConfig(redisConfig)

  def redis: Resource[IO, Jedis] = RedisFactory.wrapJedisPool(jedisPool)

  private val quillResources: (AutoCloseable, QuillFactory.PublicCtx) =
    QuillFactory.unsafeCreatePooledQuill(postgresConfig)

  val quill: QuillFactory.PublicCtx = quillResources._2

  object providers extends Providers {
    protected override val rootConfig: Config = AppContext.this.rootConfig
  }

  object web extends WebConfig {
    protected override val siteConfig: Config = rootConfig.getConfig("site")
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

  def close(): IO[Unit] = IO {
    unsafeClose()
  }
}

/** external service
  */
private[base] trait Providers {
  protected def rootConfig: Config

  val mailer: Mailer = DummyMailer

  object twitter {
    val oauth1Config: Config = rootConfig.getConfig("twitter_oauth1")

    lazy val twitterFactory: TwitterFactory =
      TwitterProvider.getTwitterFactory(oauth1Config)
  }
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
