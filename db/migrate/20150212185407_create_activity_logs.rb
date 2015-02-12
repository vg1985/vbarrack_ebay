class CreateActivityLogs < ActiveRecord::Migration
  def change
    create_table :activity_logs do |t|
      t.string :action
      t.integer :item_id, :limit => 8
      t.string :updated_formula
      t.string :updated_by
      t.timestamps
    end
  end
end
