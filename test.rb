#!/usr/bin/env ruby
#
# Queue server

require 'rubygems'
require 'eventmachine'

class QueueServer < EM::Connection

  

  def run_command(command)
    # This runs in another thread
    puts "Current value: #{@@var}"
    @@var = command
  end

  def post_init
    puts "-- someone connected to the echo server!"
  end

  def receive_data data
    send_data "HTTP/1.x 200 OK\nConnection: close\n"
    EM.defer do
    	run_command data	
    end
  end

end

EventMachine::run do
	@@var='init'
  EM.threadpool_size = 1
  puts "Threadpool is #{EM.threadpool_size}"
  EventMachine::start_server "127.0.0.1", 8081, QueueServer

  puts 'running queue server on 8081'

end
