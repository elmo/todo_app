module Mutations
  class CreateTodo < BaseMutation
    # 1. Define what arguments this mutation accepts
    argument :title, String, required: true
    argument :user_id, ID, required: true

    # 2. Define what this mutation returns
    field :todo, Types::TodoType, null: true
    field :errors, [ String ], null: false

    # 3. The execution logic
    def resolve(title:, user_id:)
      todo = Todo.new(title: title, user_id: user_id, completed: false)

      if todo.save
        { todo: todo, errors: [] }
      else
        { todo: nil, errors: todo.errors.full_messages }
      end
    end
  end
end
