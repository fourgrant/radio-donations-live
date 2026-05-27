class TransactionSyncJob < ApplicationJob
  queue_as :default

  def perform(*_guests)
    @broadcast_refresh = false
    response = get_api
    update_transactions(response.body['forms'])
    ActionCable.server.broadcast 'transactions_channel', 'refresh' if @broadcast_refresh
  end

  def get_api
    token = Settings.qgiv_token
    cursor = last_known_transaction_id
    path = cursor ?
      "/admin/api/reporting/transactions/after/#{cursor}.json" :
      "/admin/api/reporting/transactions/last/50.json"

    conn = Faraday.new(url: 'https://secure.qgiv.com') do |c|
      c.request :json
      c.response :json
      c.adapter :net_http
    end

    conn.get(path) { |req| req.params['token'] = token }
  end

  def last_known_transaction_id
    # Offset by 5 records so we re-check recent transactions each cycle.
    # Qgiv/Bloomerang may populate donationFields asynchronously after the
    # transaction is created, so re-fetching ensures we capture all custom fields.
    Transaction.order(transaction_id: :desc)
               .offset(5)
               .limit(1)
               .pluck(:transaction_id)
               .first
  end

  def update_transactions(forms)
    shoutout_question = Settings.shoutout_question

    forms.each do |form|
      transactions = form['transactions']

      transactions.each do |t|
        next unless (t['value'].to_f * 100).positive? && t['transStatus'] == 'Accepted'

        transaction = Transaction.find_by(transaction_id: t['id']) || Transaction.new
        @broadcast_refresh = true if transaction.new_record?

        note = t['donationFields']&.find { |f| f['question'] == shoutout_question }&.[]('answer')

        local_time = Time.use_zone(Settings.timezone) do
          Time.zone.parse(t['transactionDate'])
        end

        transaction.amount_in_cents = t['value'].to_f * 100
        transaction.person_id = t['donarId']
        transaction.transaction_id = t['id']
        transaction.success = t['transStatus'] == 'Accepted'
        transaction.first_name = t['firstName']
        transaction.last_name = t['lastName']
        transaction.campaign_name = t['form']['name']
        transaction.currency_code = t['billingCountry']
        transaction.note = note
        custom_field = t['donationFields']&.find { |f|
          (f['question'] || f['name']) != shoutout_question
        }
        transaction.custom_field_value1 = custom_field&.fetch('answer', nil) || custom_field&.fetch('value', nil)
        fields = t['donationFields'] || []
        if t['dedication'].present?
          fields = fields + [{ 'question' => 'Dedication', 'answer' => t['dedication'] }]
        end
        transaction.donation_fields_json = fields
        transaction.anonymous = t['transactionWasAnonymous'] == 'y' && t['firstName'].blank?
        transaction.transaction_type = t['type']
        transaction.created_at = local_time
        transaction.sync_version = t['sync_version']
        transaction.save
      end
    end
  end
end
