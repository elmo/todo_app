module Types
  class UserType < Types::BaseObject
      field :id, ID, null: false
      field :name, String
      field :email, String
      field :created_at, GraphQL::Types::ISO8601DateTime, null: false
      field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
      field :todos_count, Integer, null: false
      field :todos, [ Types::TodoType ], null: false

      def todos_count
        object.todos.size
      end
  end
end
