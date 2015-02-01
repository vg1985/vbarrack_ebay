class User < ActiveRecord::Base
  # attr_accessible :title, :body
  

  
  ACTIVE_STATUS = 'Active'
  INACTIVE_STATUS = 'Inactive'
  

  
  
  validates :email, :uniqueness => true
  validates :password, :on => :create, :presence => true
  
  
  def self.encrypt(text)
     Digest::SHA1.hexdigest("#{text}")
  end
  
  def self.authenticate(username, password)
     password = encrypt(password)
     username.present? && password.present? ? self.find_by_email_and_password(username, password) : nil
     #self.find_by_email(username)
  end
end
