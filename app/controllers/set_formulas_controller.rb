class SetFormulasController < ApplicationController
  before_filter :check_session
  before_filter :get_coutry_wise_items
  
 
  
  def index
    @items = Item.active.paginate(:page => params[:page])
    
    if params[:sort].present?
     @items = @items.order("item_formulas.#{params[:sort]} #{params[:direction]}")
    else
      @items = @items.order("end_time ASC")
    end  
     
    if params[:country].present?
      @items = @items.where("country =? ", params[:country]) 
      @country = Country.find_by_country(params[:country])
    end  
    
    @items = @items.where("item_formulas.game_platform =?", params[:game_plateform]) if params[:game_plateform].present?
    @items = @items.joins("LEFT JOIN item_formulas ON (items.item_id = item_formulas.ebay_item_id)")
   
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @items }
    end
  end
  
  
  def activity_logs
    @actvity_logs = ActivityLog.paginate(:page => params[:page]).order("id DESC")
  end
 
  def edit
    @item_details  = Item.find_by_item_id(params[:id])
    @item = ItemFormula.find_by_ebay_item_id(params[:id])
    if @item.blank?
      ItemFormula.create({:ebay_item_id => @item_details.item_id})
      @item = ItemFormula.find_by_ebay_item_id(params[:id])
    end  
    
    #redirect_to set_formulas_path unless @item.present?
  end
  
  def update
    #abort
    @item = ItemFormula.find_by_id(params[:id])
    if(@item.update_attributes(params[:item_formula])) 
       ActivityLog.create({:action => "Formula Update", :updated_by => session[:name], :item_id => @item.ebay_item_id, :updated_formula => params[:item_formula][:formula]})
       flash[:notice] = "Formula updated successfully."
       redirect_to set_formulas_path
    else 
      format.html { render action: "edit" }
    end  
  end
  
  def country
    country_bprice_details = Country.find_by_country(params[:country])
    if country_bprice_details.present?
      country_bprice_details.update_attributes({"base_price" => params[:price], "ps_base_price" => params[:ps_price], "quantity" => params[:quantity]})
    else
      Country.create({"country" => params[:country], "base_price" => params[:price], "ps_base_price" => params[:ps_price], "quantity" => params[:quantity]})
    end
    flash[:notice] = "Base price updated successfully."
     redirect_to set_formulas_path(:country => params[:country])
  end
  
end
