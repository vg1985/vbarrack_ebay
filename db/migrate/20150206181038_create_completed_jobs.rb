class CreateCompletedJobs < ActiveRecord::Migration
  def change
    create_table :completed_jobs do |t|
      t.integer :item_id, :limit => 8
      t.decimal :uppdated_price, :precision => 10, :scale => 2
      t.string :created_by
      t.text :error
      t.integer :status
      t.timestamps
    end
  end
end
