#!/usr/bin/env ruby
#
# Queue server

require 'rubygems'
require 'eventmachine'
require "http/parser"
require 'json'
require "selenium-webdriver"

class QueueServer < EM::Connection

  def initialize

    # Queue that will contain commands for slave browser to execute
    @q = EM::Queue.new

    @parser = Http::Parser.new
    @parser.on_body = proc do |body|
      @q.push body    # Putting raw JSON into the queue
    end

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

  def convert_control_key_to_symbol(control_key)
    key_map = {
      "17" => :control,
      "91" => :meta,
      "93" => :meta,
      "18" => :alt,
      "16" => :shift,
      "9" => :tab,
      "8" => :backspace,
      "13" => :enter,
      "27" => :escape,
      "46" => :delete,
      "37" => :left,
      "39" => :right,
      "40" => :down,
      "38" => :up,
      "33" => :page_up,
      "34" => :page_down,
      "36" => :home,
      "35" => :end
    }
    key_map[control_key] || control_key.downcase
  end


  def run_command(command)
    puts "Executing command #{command}"
    parsed_command = JSON.parse(command)

    begin

      case parsed_command["action"]
      when "start"
        puts "Starting slave browser "+parsed_command["slaveBrowserType"]
        native_events = parsed_command["nativeEvents"]
        caps = nil
        case parsed_command["slaveBrowserType"]
        when "ie"
          caps = Selenium::WebDriver::Remote::Capabilities.ie(:native_events => native_events)
        when "firefox"
          caps = Selenium::WebDriver::Remote::Capabilities.firefox(:native_events => native_events)
        when "chrome"
          caps = Selenium::WebDriver::Remote::Capabilities.chrome(:native_events => native_events)
        when "safari"
          caps = Selenium::WebDriver::Remote::Capabilities.safari(:native_events => native_events)
        else
          puts "Browser type #{parsed_command['slaveBrowserType']} is not supported"
          exit
        end
        @@driver = Selenium::WebDriver.for :remote, :url => parsed_command["slaveBrowserAddress"], :desired_capabilities => caps
        @@driver.get parsed_command["slaveBrowserStartUrl"]

      when "stop"
        puts "Stopping slave browser "
        @@driver.quit

      when "click"
        puts "Clicking on "+parsed_command["path"]
        element = @@driver.find_element(:xpath, parsed_command["path"])
        @@driver.action.click(element).perform

      when "mouseover"
        puts "Mouseover on "+parsed_command["path"]
        element = @@driver.find_element(:xpath, parsed_command["path"])
        @@driver.action.move_to(element).perform


      when "type"
        character = parsed_command["content"]
        puts "Typing #{character} in #{parsed_command["path"]}"
        @@driver.action.send_keys(character).perform

      when "keydown"
        control_key = convert_control_key_to_symbol(parsed_command["keyIdentifier"])
        key_buff = []
        if parsed_command["altKey"].eql?("true") && control_key != :alt
          key_buff << :alt
        end
        if parsed_command["ctrlKey"].eql?("true") && control_key != :control
          key_buff << :control
        end
        if parsed_command["metaKey"].eql?("true") && control_key != :meta
          key_buff << :meta
        end
        if parsed_command["shiftKey"].eql?("true") && control_key != :shift
          key_buff << :shift
        end
        key_buff << control_key

        if key_buff
          puts "Pressing #{key_buff}"
          @@driver.action.send_keys(key_buff).perform
        end

      when "open"
        puts "Opening #{parsed_command["path"]}"
        @@driver.get(parsed_command["path"])

      when "scroll"
        puts "Scrolling top: #{parsed_command["top"]} left: #{parsed_command["left"]}"
        @@driver.execute_script("window.scrollTo(#{parsed_command["left"]}, #{parsed_command["top"]})")

      when "resize"
        puts "Resizing width: #{parsed_command["width"]} height: #{parsed_command["height"]}"
        @@driver.manage.window.resize_to(parsed_command["width"], parsed_command["height"])

      else
        puts "Unknown command: #{parsed_command.inspect}"
      end

    rescue Exception => e
      puts "Error"
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
  @@driver=nil
  EM.threadpool_size = 1
  puts "Threadpool is #{EM.threadpool_size}"
  EventMachine::start_server "127.0.0.1", 8081, QueueServer

  puts 'running queue server on 8081'

end
