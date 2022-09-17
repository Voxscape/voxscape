package io.jokester.nuthatch.base

import cats.effect.IO
import cats.effect.kernel.Resource
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import redis.clients.jedis.Jedis
import twitter4j.{TwitterFactory}

import scala.util.{Failure, Try}

object AppContext {
  def buildDefault($rootConfig: Config): AppContext = new AppContext {
    override def rootConfig: Config     = $rootConfig
    override def redisConfig: Config    = rootConfig.getConfig("redis")
    override def postgresConfig: Config = rootConfig.getConfig("postgres")
  }
}

trait AppContext extends LazyLogging with RedisKeys {
  def rootConfig: Config
  protected def redisConfig: Config
  protected def postgresConfig: Config

  private val jedisPool          = RedisFactory.poolFromConfig(redisConfig)
  def redis: Resource[IO, Jedis] = RedisFactory.wrapJedisPool(jedisPool)

  private val quillResources: (AutoCloseable, QuillFactory.PublicCtx) =
    QuillFactory.unsafeCreatePooledQuill(postgresConfig)

  val quill: QuillFactory.PublicCtx = quillResources._2

  lazy val twitterFactory: TwitterFactory = {
    val conf = rootConfig.getConfig("twitter_oauth1")
    TwitterProvider.getTwitterFactory(conf)
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

  def close(): IO[Unit] = IO { unsafeClose() }
}
