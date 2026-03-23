# app/graphql/mutations/destroy_todo.rb
module Mutations
  class DestroyTodo < BaseMutation
    # We only need the ID to find the record
    argument :id, ID, required: true

    # Return the ID of the deleted item so the frontend can update its cache
    field :id, ID, null: true
    field :errors, [ String ], null: false

    def resolve(id:)
      todo = Todo.find_by(id: id)

      if todo&.destroy
        {
          id: id,
          errors: []
        }
      else
        {
          id: nil,
          errors: [ "Todo not found or could not be deleted" ]
        }
      end
    end
  end
end
