#!/usr/bin/env ruby
#
# Queue server

require 'rubygems'
require 'eventmachine'
require "http/parser"
require 'json'
require "selenium-webdriver"

class QueueServer < EM::Connection

  def initialize(driver)

    # Queue that will contain commands for slave browser to execute
    @q = EM::Queue.new

    @parser = Http::Parser.new
    @parser.on_body = proc do |body|
      @q.push body 		# Putting raw JSON into the queue
    end

    @driver = driver

    # Proc that processes queue item
    process_q = Proc.new do |command|

      # Start new thread and run item processing there, once it's done poll queue again
      EM.defer do
        run_command command
        @q.pop(&process_q)
      end
    end

    # Kick off queue processing
    @q.pop(&process_q)
  end

  def run_command(command)
    #puts "Executing command #{command}"
    parsed_command = JSON.parse(command)
    case parsed_command["action"]
    when "click"
    	puts "Clicking on "+parsed_command["path"]
      @driver.find_element(:xpath, parsed_command["path"]).click
    when "type"
    	puts "Typing #{parsed_command["content"].to_i.chr} in #{parsed_command["path"]}"
     	@driver.switch_to.active_element.send_keys(parsed_command["content"].to_i.chr)      	    	
    	
    when "open"
    	puts "Opening #{parsed_command["path"]}"
      @driver.get(parsed_command["path"])
    else
      puts "Unknown command: #{parsed_command.inspect}"
    end        
  end

  def post_init
    puts "-- someone connected to the echo server!"
  end

  def receive_data data    
    send_data "HTTP/1.x 200 OK\nConnection: close\n"    
    close_connection_after_writing
    @parser << data
  end


end

EventMachine::run do
  driver = Selenium::WebDriver.for :firefox
  driver.navigate.to "http://localhost:3000"

  EventMachine::start_server "127.0.0.1", 8081, QueueServer, driver

  puts 'running queue server on 8081'

end
