FactoryBot.define do
  factory :todo do
    title { "Finish the Rails API" }
    completed { false }
    association :user # This automatically creates a user if one isn't provided!
  end
end
