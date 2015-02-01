class Item < ActiveRecord::Base
  # attr_accessible :title, :body
  self.per_page = 25
  scope :active, -> { where("end_time >= ?", Date.today) } 
end