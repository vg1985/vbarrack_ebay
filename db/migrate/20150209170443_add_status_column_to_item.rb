class AddStatusColumnToItem < ActiveRecord::Migration
  def change
    add_column :items, :status, :string
  end
end
