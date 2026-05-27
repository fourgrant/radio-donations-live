class AddDonationFieldsJsonToTransactions < ActiveRecord::Migration[6.1]
  def change
    add_column :transactions, :donation_fields_json, :text
  end
end
