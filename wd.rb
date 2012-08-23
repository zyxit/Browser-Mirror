require 'selenium-webdriver'
caps = Selenium::WebDriver::Remote::Capabilities.firefox(:native_events => true)
driver = Selenium::WebDriver.for :remote, :url => "http://localhost:4444/wd/hub", :desired_capabilities => caps
driver.navigate.to "http://www.cs.tut.fi/~jkorpela/www/testel.html"
driver.find_element(:css=>'#f1').click
threads = []
3.times do 
  threads << Thread.new do 
  	puts "Pressing a"
    driver.action.send_keys(['a']).perform
    puts "Pressed"
  end
end


threads.each do |aThread| 
  aThread.join
end

driver.quit