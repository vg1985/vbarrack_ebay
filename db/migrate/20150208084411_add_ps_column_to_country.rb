class AddPsColumnToCountry < ActiveRecord::Migration
  def change
    add_column :countries, :ps_base_price, :decimal, :precision => 10, :scale => 2
  end
end
