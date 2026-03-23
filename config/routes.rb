require "graphiql/rails"
Rails.application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end

  post "/graphql", to: "graphql#execute"

  get "up" => "rails/health#show", as: :rails_health_check
  root "home#index"
  get "home/index"
  get "registrations/new"
  get "registrations/create"
  resource :registrations, only: [ :new, :create ]
  resource :session
  resources :passwords, param: :token
  resource :session
  resources :passwords, param: :token
  namespace :api do
    namespace :v1 do
      post "login", to: "sessions#create"
      post "users", to: "users#create"
       resources :todos
    end
  end
 end
