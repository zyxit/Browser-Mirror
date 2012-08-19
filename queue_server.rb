#!/usr/bin/env ruby
#
# Queue server

require 'rubygems'
require 'eventmachine'

class QueueServer < EM::Connection

  def initialize(q)
    @q = q

    # Proc that processes queue item
    process_q = Proc.new do |command|

      # Start new thread and run item processing there, once it's done poll queue again
      EM.defer do
        run_command command
        q.pop(&process_q)
      end
    end

    # Kick off queue processing
    q.pop(&process_q)
  end

  def run_command(command)
    puts "Executing command #{command}"
    sleep 2
    puts "Command #{command} executed"
  end


  def post_init
    puts "-- someone connected to the echo server!"
  end

  def receive_data command
    send_data "Received command #{command}"
    @q.push command
  end
end

EventMachine::run do

  # Queue that will contain commands for slave browser to execute
  q = EM::Queue.new

  EventMachine::start_server "127.0.0.1", 8081, QueueServer, q

  puts 'running queue server on 8081'

end
