class AddGameCoinsColumnToItem < ActiveRecord::Migration
  def change
    add_column :items, :game_coins_amount, :decimal, :precision => 10, :scale => 2
  end
end
