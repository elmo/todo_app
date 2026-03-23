module Mutations
  class ToggleTodo < BaseMutation
    argument :id, ID, required: true

    field :todo, Types::TodoType, null: true
    field :errors, [ String ], null: false

    def resolve(id:)
      todo = Todo.find(id)

      if todo.update(completed: !todo.completed)
        { todo: todo, errors: [] }
      else
        { todo: nil, errors: todo.errors.full_messages }
      end
    end
  end
end
