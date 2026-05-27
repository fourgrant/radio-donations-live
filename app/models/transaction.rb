class Transaction < ApplicationRecord
  serialize :donation_fields_json, JSON

  # Total raised, in cents. Scoped to DRIVE_START_DATE when set so the goal bar
  # reflects the current drive rather than every donation ever synced.
  def self.total_raised
    scope = all
    scope = scope.where('created_at >= ?', Settings.drive_start_date) if Settings.drive_start_date
    scope.sum(:amount_in_cents)
  end
end
