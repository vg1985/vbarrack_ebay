module ApplicationHelper
  def new_price(formula, is_country, baseprice_details)
    if(formula.present? && is_country.present? && baseprice_details.base_price)
      puts "-----------#{formula}-----------"
      formula = formula.gsub('base_price', baseprice_details.base_price.to_s)
      begin
        new_price = eval(formula).round(2)
      rescue
        new_price = '' 
      end
    else
      new_price = ''
    end 
    new_price
  end
end
