class ChangeBasePriceColumn < ActiveRecord::Migration
  def up
    change_column :countries, :base_price, :decimal, :precision => 10, :scale => 2
  end

  def down
  end
end
