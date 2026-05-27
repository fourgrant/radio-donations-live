class AddFieldsToTransaction < ActiveRecord::Migration[6.1]
  def change
    add_column :transactions, :custom_field_value1, :string
    add_column :transactions, :sync_version, :integer
    add_column :transactions, :completed, :boolean, default: false
  end
end
