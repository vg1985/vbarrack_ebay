class ApplicationController < ActionController::Base
  protect_from_forgery
  
  def check_session
    redirect_to root_url unless session[:id].present?
  end
  
  private
  def get_coutry_wise_items
    @country_wise_items = Item.active.select("count(id) As item_count, country").order("country").group("country")
  end
  
  def sync_with_ebay
    items = EbayClient.api.get_seller_list(:sort => 2, :listing_type => "FixedPriceItem",  :granularity_level => "Coarse", :end_time_from => Date.today, :end_time_to => Date.today+119.days, :pagination => {:entries_per_page => 100})
    #raise items.inspect
    if items.present?
       item_details = items.payload[:item_array][:item]
       current_page = items.payload[:page_number]
       next_page = (current_page.to_i + 1)
       total_page = items.payload[:pagination_result][:total_number_of_pages].to_i
       
       item_updates_in_vbarrack(item_details)
       
      #raise "nnnnnn#{next_page}----------tppppppp#{total_page}---".inspect
       for page in next_page..total_page
        items = EbayClient.api.get_seller_list(:sort => 2, :listing_type => "FixedPriceItem",  :granularity_level => "Coarse", :end_time_from => Date.today, :end_time_to => Date.today+119.days, :pagination => {:entries_per_page => 100, :page_number => page})
        item_details = items.payload[:item_array][:item]
        item_updates_in_vbarrack(item_details)
       end
    end
  end
  
  def item_updates_in_vbarrack(item_details)
    if item_details.present?
      item_details.each do |item_detail|
        item_id = item_detail[:item_id]
        start_time = Date.parse(item_detail[:listing_details][:start_time])
        end_time = Date.parse(item_detail[:listing_details][:end_time])
        quantity_available = item_detail[:quantity]
        quantity_sold = item_detail[:selling_status][:quantity_sold]
        bid_count = item_detail[:selling_status][:bid_count]
        
        title = item_detail[:title]
        subtitle = item_detail[:sub_title]
        picture_url = item_detail[:picture_details][:gallery_url]
        view_url = item_detail[:listing_details][:view_item_url]
        
        sku = item_detail[:sku]
        country = item_detail[:country]
        currency = item_detail[:currency]
        buy_it_now_price = item_detail[:selling_status][:current_price]
        
        category_id = item_detail[:primary_category][:category_id]
        category_name = item_detail[:primary_category][:category_name]
       
        
        item_info = Item.find_by_item_id(item_id.to_i)
        
        item_hash = {:start_time => start_time, :end_time => end_time, :quantity_available => quantity_available, :quantity_sold => quantity_sold,
                     :title => title, :sub_title => subtitle, :picture_url => picture_url, :view_url => view_url, :sku => sku, :country => country,
                     :currency => currency, :buy_it_now_price => buy_it_now_price, :category_id => category_id, :category_name => category_name
                    }
                   
        if item_info.present?
          puts "-------UPDATE-----"
          item_info.update_attributes(item_hash)
        else
          item_hash[:item_id] = item_id
          Item.create(item_hash)
        end
      end
      
    end
    
  end
end
