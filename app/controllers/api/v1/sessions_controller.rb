module Api
  module V2
    class SessionsController < ApplicationController
      rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
      rescue_from ActiveRecord::RecordInvalid, with: :record_invalid

      def create
        user = User.find_by(email: params[:email])

        if user&.authenticate(params[:password])
          # Issue the token using the Service Object we built
          token = JwtService.encode(user_id: user.id)

          render json: {
            token: token,
            user: { id: user.id, email: user.email }
          }, status: :ok
        else
          render json: { error: "Invalid credentials" }, status: :unauthorized
        end
      end

     private

     def record_not_found(error)
       render json: { error: error.message }, status: :not_found
     end

      def record_invalid(error)
        render json: { errors: error.record.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end
end
