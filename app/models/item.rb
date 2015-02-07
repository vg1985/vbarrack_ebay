class Item < ActiveRecord::Base
  # attr_accessible :title, :body
  self.per_page = 100
  scope :active, -> { where("end_time >= ?", Date.today) } 
  
  def self.item_update(item, price)
    ebay = EbayClient.api.revise_inventory_status(:inventory_status => {:item_ID => item, :start_price => price})
    
    if(ebay.present? && ebay.errors.count < 1)
       item_details = Item.find_by_item_id(item)
       item_details.update_attributes({:buy_it_now_price => price})
       CompletedJob.create(:item_id => item, :uppdated_price => price,  :status => 1)
    else
       CompletedJob.create(:item_id => item, :uppdated_price => price, :error => ebay.errors.join("</br>"), :status => 0)
    end  
  
  end
end
