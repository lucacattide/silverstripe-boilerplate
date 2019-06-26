desc "SSH agent forwarding check"
task :agent_forwarding do
  on roles(:all) do |h|
    if test("env | grep SSH_AUTH_SOCK")
      info "Agent forwarding is enabled on #{h}"
    else
      error "Agent forwarding isn't enabled on #{h}"
    end
  end
end
