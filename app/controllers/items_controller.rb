class ItemsController < ApplicationController
  before_filter :check_session
  before_filter :get_coutry_wise_items
  
  def index
    sync_with_ebay if params[:sync] == "sync"
    if @country_wise_items.present?
      @items = Item.active.paginate(:page => params[:page]).order("end_time ASC")
      if params[:country].present?
        @items = @items.where("country =? ", params[:country])
        @country_bprice = Country.find_by_country(params[:country])
      end  
      
      respond_to do |format|
        format.html # index.html.erb
        format.json { render json: @items }
      end
    end
    #raise @country_wise_items.inspect
    
    #page = params[:page].present? ? params[:page].to_i : 1
    
    #@items = EbayClient.api.get_my_ebay_selling(:active_list => {:pagination => {:entries_per_page => 50, :page_number => page}})
    #raise  @items.inspect
    
     
    #raise  @items.payload[:item_array][:item][0].inspect
    
    
    #raise EbayClient.api.get_item(:item_ID => 271721430818).inspect

    
    #https://api.sandbox.ebay.com/wsapi
    #EbayClient.api.revise_item(:item => {:item_id => 110155330342,:selling_price => {:current_price => 10}})

    #raise @items.inspect
    #raise @items.payload[:active_list][:pagination_result][:total_number_of_pages].inspect
    #raise items.payload[:active_list].inspect
  end
  

  
  def edit
    item_details = EbayClient.api.get_item(:item_ID => params[:id])
    #raise item_details.inspect
    @item = item_details.payload[:item]
    redirect_to items_path unless @item.present?
  end
  
  def update
    #abort
    @ebay = EbayClient.api.revise_inventory_status(:inventory_status => {:item_ID => params[:id], :start_price => params[:price]})
    if(@ebay.present? && @ebay.errors.count > 0) 
       flash[:error] = @ebay.errors.join('</br>')
    else 
       @item = Item.find_by_item_id(params[:id].to_i)
       @item.update_attributes({:buy_it_now_price => params[:price]})
       flash[:notice] = "Price updated successfully."
    end  
    redirect_to edit_item_path(params[:id])
  end
  
  def bulk_update
    if(params[:item].present?)
      params[:item].each do |item_id|
        Item.delay.item_update(item_id, params["price_#{item_id}"])
      end
    end  
    
    flash[:notice] = "Price update process has been queued up. Please refresh the page after some time to reflect the updated price."
    redirect_to items_path
  end
  
end
