# server-based syntax
# ======================
# Defines a single server with a list of roles and multiple properties.
# You can define all roles on a single server, or split them:

# server "example.com", user: "deploy", roles: %w{app db web}, my_property: :my_value
# server "example.com", user: "deploy", roles: %w{app web}, other_property: :other_value
# server "db.example.com", user: "deploy", roles: %w{db}



# role-based syntax
# ==================

# Defines a role with one or multiple servers. The primary server in each
# group is considered to be the first unless any hosts have the primary
# property set. Specify the username and a domain or IP for the server.
# Don't use `:all`, it's a meta role.

# role :app, %w{deploy@example.com}, my_property: :my_value
# role :web, %w{user1@primary.com user2@additional.com}, other_property: :other_value
# role :db,  %w{deploy@example.com}




# Configuration
# =============
# You can set any configuration variable like in config/deploy.rb
# These variables are then only loaded and set in this stage.
# For available Capistrano configuration variables see the documentation page.
# http://capistranorb.com/documentation/getting-started/configuration/
# Feel free to add new variables to customise your setup.

set :branch, 'master'
set :deploy_to, "/home//"
set :tmp_dir, "/home//tmp/"
# Document Root Link
set :public_html_path, '/home/bhp2/'
set :dump_path, '/home/bhp2//_db'
set :capistrano_path, '/home/bhp2/'

# Definizione Timing Esecuzione
after "deploy:symlink:release", "deploy:symlink:release_public_html"

# Deploy
namespace :deploy do
	# Linking/DB Dumping/Permessi
	namespace :symlink do
	  desc "Symlink release to current - assets and project permissions changing"

	  task :release_public_html do
			on release_roles :all do
				public_html_path = "#{fetch(:public_html_path)}"
				capistrano_path = "#{fetch(:capistrano_path)}"
				dump_path = "#{fetch(:dump_path)}"
				db = ''
				db_user = ''
				db_password = ''

				# Ridefinisci il symlink
				execute :rm, "-rf", public_html_path, "&&", :ln, "-s", current_path, public_html_path

				within current_path do
					# Controllo Path
					# Se esiste elimina/copia
					if Dir.exist?(dump_path)
						execute :rm, "-rf", dump_path + "/*", "&&", :mysqldump, "-u", db_user, "-p#{db_password}", db, ">", dump_path + "/.sql"
					else #altrimenti crea/copia
						execute :mkdir, "-p", dump_path, "&&", :mysqldump, "-u", db_user, "-p#{db_password}", db, ">", dump_path + "/.sql"
					end

					# Copia i sorgenti ottimizzati nelle path di destinazione e rimuove le cartelle native
					execute :cp, "-rf", "#{public_html_path}/dist/*.php", public_html_path
					execute :cp, "-rf", "#{public_html_path}/php/dist/php/*.php", "#{public_html_path}/php"
					execute :rm, "-rf", "#{public_html_path}/dist"
					execute :rm, "-rf", "#{public_html_path}/php/dist"
					# Modifica permessi
					execute :find, ". -type d -exec chmod 755 '{}' ';'"
					execute :find, ". -type f -exec chmod 644 '{}' ';'"
				end
			end
	  end
	end
end

# Custom SSH Options
# ==================
# You may pass any option but keep in mind that net/ssh understands a
# limited set of options, consult the Net::SSH documentation.
# http://net-ssh.github.io/net-ssh/classes/Net/SSH.html#method-c-start
#
# Global options
# --------------
#  set :ssh_options, {
#    keys: %w(/home/rlisowski/.ssh/id_rsa),
#    forward_agent: false,
#    auth_methods: %w(password)
#  }
#
# The server-based syntax can be used to override options:
# ------------------------------------
# server "example.com",
#   user: "user_name",
#   roles: %w{web app},
#   ssh_options: {
#     user: "user_name", # overrides user setting above
#     keys: %w(/home/user_name/.ssh/id_rsa),
#     forward_agent: false,
#     auth_methods: %w(publickey password)
#     # password: "please use keys"
#   }

server "",
user: "",
roles: %w{web},
ssh_options: {
	user: "",
	keys: %w(/Users//.ssh/),
	forward_agent: true,
	auth_methods: %w(publickey password),
	password: ""
}