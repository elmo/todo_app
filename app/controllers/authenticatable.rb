
module Api
  module Authenticatable
  extend ActiveSupport::Concern
    def authenticate_request
      header = request.headers["Authorization"]
      token = header.split(" ").last if header.present?

      # Use the Service Object we discussed earlier to decode
      decoded = JwtService.decode(token)
      if decoded
        @current_user = User.find(decoded[:user_id])
      else
        render json: { error: "Not Authorized" }, status: :unauthorized
      end
    rescue ActiveRecord::RecordNotFound
      render json: { error: "User not found" }, status: :unauthorized
    end
  end
end
