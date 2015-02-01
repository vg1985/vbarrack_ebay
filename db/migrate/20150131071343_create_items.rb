class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.integer :item_id
      t.string :title
      t.string :sub_title
      t.string :picture_url
      t.string :sku
      t.string :country
      t.string :currency
      t.decimal :start_price, :precision => 2, :scale => 1
      t.decimal :buy_it_now_price, :precision => 2, :scale => 1
      t.integer :quantity_available
      t.integer :quantity_sold
      t.date :start_time
      t.date :end_time
      t.string :view_url
      t.integer :category_id
      t.string :category_name
      
      t.timestamps
    end
  end
end
