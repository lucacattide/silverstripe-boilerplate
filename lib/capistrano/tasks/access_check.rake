desc "Access control"
task :check_write_permissions do
  on roles(:all) do |host|
    if test("[ -w #{fetch(:deploy_to)} ]")
      info "#{fetch(:deploy_to)} is writeable on #{host}"
    else
      error "#{fetch(:deploy_to)} isn't writeable on #{host}"
    end
  end
end
