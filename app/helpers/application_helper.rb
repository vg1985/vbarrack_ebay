module ApplicationHelper
  
  def new_price(game_platform, formula, is_country, baseprice_details)
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
