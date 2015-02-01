class SetFormulasController < ApplicationController
  before_filter :check_session
  before_filter :get_coutry_wise_items
  
  def index
    @items = Item.active.paginate(:page => params[:page]).order("end_time ASC")
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

end
