class SessionsController < ApplicationController
  layout "authenticate"
  
  def login
    redirect_to root_url unless session[:id].nil?
   
  end
  
  def authenticate
    user_info = User.authenticate(params[:username], params[:password])
      
    if user_info.present?
     
        session[:id] = user_info.id 
        
        session[:name] = user_info.name
        redirect_to items_path
    else
      flash['error'] = 'Incorrect Username or Password!'
      redirect_to root_url
    end   
  end
  

  def retry_password
     user_info = User.find_by_email(params[:email])
     bool =  user_info.present? ? true : false
     if bool
      new_password = SecureRandom.urlsafe_base64(5)
      logger.info "-----New Password---#{new_password}----"
      user_info.password = User.encrypt(new_password)  
      user_info.save
      EbayMailer.reset_password_mail(user_info, new_password).deliver if bool
     end
     respond_to do |format|
       format.js { render :text => bool }
     end
  end
  
  def logout
      
      reset_session
      redirect_to root_url and return
      
  end
  


end
