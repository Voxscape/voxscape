package io.jokester.nuthatch.authn

import com.typesafe.scalalogging.LazyLogging

trait AuthenticationService
    extends BaseAuth
    with TwitterOAuth1
    with EmailSignup
    with EmailLogin
    with OAuthCredProvider
    with LazyLogging {}
