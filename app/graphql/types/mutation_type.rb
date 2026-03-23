module Types
  class MutationType < Types::BaseObject
    field :create_todo, mutation: Mutations::CreateTodo
    field :toggle_todo, mutation: Mutations::ToggleTodo
    field :destroy_todo, mutation: Mutations::DestroyTodo
  end
end
