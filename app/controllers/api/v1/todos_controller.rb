module Api
  module V1
    class Api::V1::TodosController < ApplicationController
      include Authenticatable
      before_action :authenticate_by_jwt
      before_action :get_todo, only: [ :update, :destroy ]
      skip_before_action :verify_authenticity_token

      def index
        @todos = @current_user.todos.order(created_at: :desc)
        render json: @todos
      end

      def create
        @todo = @current_user.todos.new(todo_params)
        if @todo.save
          render json: @todo, status: :created
        else
          render json: @todo.errors, status: :unprocessable_entity
        end
      end

      def update
        @todo.update(todo_params)
        render json: @todo
      end

      def destroy
        @todo.destroy
        head :no_content
      end

      private

      def get_todo
        @todo = @current_user.todos.find(params[:id])
      end

      def todo_params
        params.require(:todo).permit(:title, :completed)
      end
    end
  end
end
