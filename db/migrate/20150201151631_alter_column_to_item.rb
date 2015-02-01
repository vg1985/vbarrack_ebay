class AlterColumnToItem < ActiveRecord::Migration
  def up
    change_column :items, :buy_it_now_price, :decimal, :precision => 10, :scale => 2
  end

  def down
  end
end
