class SetFormulasController < ApplicationController
  before_filter :check_session
  before_filter :get_coutry_wise_items
  
  helper_method  :sort_direction
  
  def index
    @items = Item.active.paginate(:page => params[:page])
    
    if params[:sort].present?
     @items = @items.order("#{params[:sort]} #{params[:direction]}")
    else
      @items = @items.order("end_time ASC")
    end  
     
    if params[:country].present?
      @items = @items.where("country =? ", params[:country]) 
      @country = Country.find_by_country(params[:country])
    end  
    @items = @items.where("game_platform =?", params[:game_plateform]) if params[:game_plateform].present?
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @items }
    end
  end
 
  def edit
    @item = Item.find_by_id(params[:id])
    #redirect_to set_formulas_path unless @item.present?
  end
  
  def update
    @item = Item.find_by_id(params[:id])
    if(@item.update_attributes(params[:item])) 
       flash[:notice] = "Formula updated successfully."
       redirect_to set_formulas_path
    else 
      format.html { render action: "edit" }
    end  
  end
  
  def country
    country_bprice_details = Country.find_by_country(params[:country])
    if country_bprice_details.present?
      country_bprice_details.update_attribute(:base_price, params[:price])
    else
      Country.create({:country => params[:country], :base_price => params[:price]})
    end
    flash[:notice] = "Base price updated successfully."
     redirect_to set_formulas_path(:country => params[:country])
  end
  
    
  def sort_direction
    %w[asc desc].include?(params[:direction]) ? params[:direction] : "asc"
  end

end
