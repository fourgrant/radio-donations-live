class CreateTransactions < ActiveRecord::Migration[6.0]
  def change
    create_table :transactions do |t|
      t.integer :amount_in_cents
      t.integer :person_id
      t.integer :transaction_id
      t.boolean :success
      t.string :first_name
      t.string :last_name
      t.string :campaign_name
      t.string :currency_code
      t.string :note
      t.string :transaction_type
      t.datetime :created_at
    end
  end
end
