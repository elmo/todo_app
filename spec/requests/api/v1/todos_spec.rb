require 'rails_helper'

# Ensure the second argument looks exactly like this:
RSpec.describe "GET /api/v1/todos", type: :request do
  let(:user) { create(:user) }

  it "allows access with a valid JWT" do
    token = ::JwtService.encode(user_id: user.id)
    # Now 'get' will be recognized!
    get "/api/v1/todos", headers: { "Authorization" => "Bearer #{token}" }
    
    expect(response).to have_http_status(:ok)
  end
end
