# Change 'namespace :test' to something unique like 'spec' or 'ci'
namespace :ci do
  desc "Migrate, Build, and Run RSpec + Vitest"
  task :all do
    puts "--- Preparing Database ---"
    # 'db:test:prepare' is fine, but we follow it with RSpec
    system("bin/rails db:test:prepare")

    puts "\n--- Running RSpec ---"
    # Use 'bundle exec rspec' specifically to avoid 'rails test'
    rspec_success = system("bundle exec rspec")

    puts "\n--- Running Vitest ---"
    vitest_success = system("npx vitest run app/javascript")

    exit(1) unless rspec_success && vitest_success
  end
end
