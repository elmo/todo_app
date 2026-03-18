Rails.application.routes.draw do
  get "registrations/new"
  get "registrations/create"
  resource :registrations, only: [ :new, :create ] # Add this line
  resource :session
  resources :passwords, param: :token
  get "home/index"
  get "up" => "rails/health#show", as: :rails_health_check
  Rails.application.routes.draw do
  get "registrations/new"
  get "registrations/create"
  resource :session
  resources :passwords, param: :token
  get "home/index"
  root "home#index"
    resources :todos
  end

  namespace :api do
    namespace :v1 do
      post "login", to: "sessions#create"
       resources :todos
    end
  end
end
