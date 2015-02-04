class CreateCountries < ActiveRecord::Migration
  def change
    create_table :countries do |t|
      t.string  :country
      t.integer :base_price
      t.timestamps
    end
  end
end
