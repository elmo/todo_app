# app/controllers/api/v1/users_controller.rb
#
class Api::V1::SessionsController < ApplicationController
  # Skip the JWT check for the login action itself!
  protect_from_forgery with: :null_session
  skip_before_action :authenticate_by_jwt, raise: false

  def create
    @user = User.new(user_params)
    if @user.save
      token = JwtService.encode({ user_id: @user.id })
      render json: { token: token, user: @user }, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
