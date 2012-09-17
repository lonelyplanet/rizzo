current = File.expand_path(File.join(File.dirname(__FILE__)))

worker_processes 3
working_directory current 

preload_app true

pid File.join(current, '../tmp/pids/unicorn.pid')
listen File.join(current, '../tmp/sockets/unicorn.sock'), :backlog => 64

timeout 30

stderr_path File.join(current, '../log/unicorn.stderr.log')
stdout_path File.join(current, '../log/unicorn.stdout.log')

