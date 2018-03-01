desc "Controllo SSH agent forwarding"
task :agent_forwarding do
  on roles(:all) do |h|
    if test("env | grep SSH_AUTH_SOCK")
      info "Agent forwarding è in funzione su #{h}"
    else
      error "Agent forwarding non è in funzione su #{h}"
    end
  end
end
