namespace :ebay do 
  desc "move formula" 
  task :formula => :environment do   
    @items = Item.all 
    @items.each do |item|  
      item_formula  = ItemFormula.create({:ebay_item_id => item.item_id, :formula => item.formula, :game_platform => item.game_platform, :game_coins_amount => item.game_coins_amount})
    end 
  end
 

end