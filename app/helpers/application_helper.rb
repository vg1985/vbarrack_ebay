module ApplicationHelper
  
  def new_price(game_platform, formula, is_country, baseprice_details)
    #raise params.inspect
    new_price = ''
    if(formula.present? && is_country.present?)
      unless baseprice_details.present?
        baseprice_details = Country.find_by_country(is_country)
      end     
      
      if baseprice_details.present?
        if game_platform == "XBOX" && baseprice_details.base_price.present?
          formula = formula.gsub('base_price', "(#{baseprice_details.base_price.to_s})")
          begin
            new_price = eval(formula).round(2)
          rescue
           
          end
        elsif game_platform == "PS" && baseprice_details.ps_base_price.present?
          formula = formula.gsub('base_price', "(#{baseprice_details.ps_base_price.to_s})")
          begin
            new_price = eval(formula).round(2)
           
          rescue
           
          end
        end    
      end  
    
    end
    
    if new_price.present?
      if params[:discount].present?
        new_price = (new_price - ((new_price * params[:discount].to_f).to_f / 100)).round(2)
      end
      if params[:plus].present?
        new_price = (new_price + params[:plus].to_f).round(2)
      end
      if params[:minus].present?
        new_price = (new_price - params[:minus].to_f).round(2)
      end
       new_price = new_price < 0 ? 0 : new_price

    end
      
      
    new_price
  end
  
  def new_quantity(is_country, qua_details)
    new_quantity = ''
    if(is_country.present?)
      unless qua_details.present?
        qua_details = Country.find_by_country(is_country)
      end     
      new_quantity = qua_details.quantity if qua_details.present?
    end
    new_quantity
  end
  
  
  def sortable(column, title = nil)
    title ||= column.titleize
    css_class = column == params[:sort] ? "current #{sort_direction}" : nil
    if column == 'created_at' && params[:sort].blank?
      css_class = "current desc"  
    end
    direction = sort_direction == "asc" ? "desc" : "asc"
    link_to(title, params.merge({:sort => column, :direction => direction}), {:class => css_class})
  end


end
