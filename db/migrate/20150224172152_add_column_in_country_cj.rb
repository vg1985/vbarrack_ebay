class AddColumnInCountryCj < ActiveRecord::Migration
  def up
    add_column :countries, :quantity, :integer
    add_column :completed_jobs, :job_type, :string, :default => "price"
  end

  def down
  end
end
