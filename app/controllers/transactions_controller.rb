class TransactionsController < ApplicationController
  http_basic_authenticate_with(
    name: Settings.dashboard_user,
    password: Settings.dashboard_password,
    only: [:index]
  )

  skip_before_action :verify_authenticity_token

  def index
    @transactions = Transaction.order(created_at: :desc).limit(50)

    respond_to do |format|
      format.html {}
      format.json do
        render json: {
          transactions: @transactions,
          total_raised: Transaction.total_raised,
          goal_amount: Settings.goal_amount
        }, status: :ok
      end
    end
  end

  def update
    transaction = Transaction.find(params[:id])
    transaction.completed = update_transaction_params[:completed]

    respond_to do |format|
      if transaction.save
        format.json { render json: { transaction: transaction }, status: :ok }
      else
        format.json { render json: { message: transaction.errors.full_messages.join(', '), status: :unprocessable_entity } }
      end
    end
  end

  private

  def update_transaction_params
    params.require(:transaction).permit(:id, :completed)
  end
end
