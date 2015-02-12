class CreateItemFormulas < ActiveRecord::Migration
  def change
    create_table :item_formulas do |t|
      t.integer :ebay_item_id, :limit => 8
      t.string :formula
      t.string :game_platform
      t.decimal :game_coins_amount, :precision => 10, :scale => 2
      t.timestamps
    end
  end
end
