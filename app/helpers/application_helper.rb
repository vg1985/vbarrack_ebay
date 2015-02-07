module ApplicationHelper
  
  def new_price(formula, is_country, baseprice_details)
    new_price = ''
    if(formula.present? && is_country.present?)
      unless baseprice_details.present?
        baseprice_details = Country.find_by_country(is_country)
      end     
      if baseprice_details.present?
        formula = formula.gsub('base_price', "(#{baseprice_details.base_price.to_s})")
        begin
          new_price = eval(formula).round(2)
        rescue
         
        end
      end  
    end
   
    new_price
  end

end
