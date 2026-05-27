require 'rails_helper'

describe TransactionsController do
  describe 'index' do
    before do
      request.env['HTTP_AUTHORIZATION'] =
        ActionController::HttpAuthentication::Basic.encode_credentials(
          Settings.dashboard_user, Settings.dashboard_password
        )
    end

    it 'returns transactions, total_raised, and goal_amount as JSON' do
      Transaction.create(amount_in_cents: 5000, completed: false)

      get :index, format: :json
      expect(response).to have_http_status :ok

      body = JSON.parse(response.body)
      expect(body['transactions'].length).to eq(1)
      expect(body['total_raised']).to eq(5000)
      expect(body).to have_key('goal_amount')
    end

    it 'requires basic auth' do
      request.env.delete('HTTP_AUTHORIZATION')
      get :index, format: :json
      expect(response).to have_http_status :unauthorized
    end
  end

  describe 'update' do
    let(:transaction) { Transaction.create(completed: false) }

    let(:valid_params) do
      { "id": transaction.id, "transaction": { "completed": true } }
    end

    subject { put :update, params: valid_params, format: :json }

    it 'marks the transaction completed' do
      subject
      expect(response).to have_http_status :ok
      expect(transaction.reload.completed).to be_truthy
    end
  end
end
