desc "Controllo accessi"
task :check_write_permissions do
  on roles(:all) do |host|
    if test("[ -w #{fetch(:deploy_to)} ]")
      info "#{fetch(:deploy_to)} è scrivibile su #{host}"
    else
      error "#{fetch(:deploy_to)} non è scrivibile su #{host}"
    end
  end
end
