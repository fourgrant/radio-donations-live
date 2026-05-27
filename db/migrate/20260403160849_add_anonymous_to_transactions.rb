class AddAnonymousToTransactions < ActiveRecord::Migration[6.1]
  def change
    add_column :transactions, :anonymous, :boolean, default: false
  end
end
