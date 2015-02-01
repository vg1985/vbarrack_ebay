class EbayMailer < ActionMailer::Base
  default :from => "vk.agile@gmail.com"
  
   def reset_password_mail(user, password)
    @user = user
    @password = password
    mail(:to => user.email, :subject => "Vbarrack : Ebay Store -  Password")
   end

end

