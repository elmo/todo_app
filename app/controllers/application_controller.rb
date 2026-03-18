class ApplicationController < ActionController::Base
  allow_browser versions: :modern
  # Standard Rails security for Session/Cookie users
  protect_from_forgery with: :exception
  # Skip CSRF check if the request is an API call with a JWT
  skip_before_action :verify_authenticity_token, if: :jwt_request?

  private

  def jwt_request?
    request.headers["Authorization"].present?  # If the Authorization header exists, we assume it's a JWT API call
  end
end
