# Central, env-driven configuration for the donation board.
# Every station-specific value lives here so the codebase stays generic.
# See .env.example and the README for what each variable does.
module Settings
  module_function

  # Bloomerang Fundraising / Qgiv reporting API token ("all forms" permanent token).
  def qgiv_token
    ENV.fetch('QGIV_API_TOKEN')
  end

  # HTTP Basic Auth for the dashboard (the public /transactions page).
  def dashboard_user
    ENV.fetch('DASHBOARD_USER', 'admin')
  end

  def dashboard_password
    ENV.fetch('DASHBOARD_PASSWORD', 'changeme')
  end

  # Public hostname, e.g. "donations.mystation.org". Drives allowed hosts and
  # ActionCable origins in production.
  def app_host
    ENV['APP_HOST']
  end

  # Station display name shown in the header and page title.
  def station_name
    ENV.fetch('STATION_NAME', 'Community Radio')
  end

  # IANA timezone used to localize Qgiv transaction timestamps.
  def timezone
    ENV.fetch('STATION_TIMEZONE', 'America/New_York')
  end

  # The exact Qgiv donation-form question whose answer is treated as the
  # on-air shoutout. Leave at default if your form uses a different question;
  # all other custom fields still display regardless.
  def shoutout_question
    ENV.fetch('SHOUTOUT_QUESTION', 'Want to leave a shoutout for a DJ or show?')
  end

  # Fundraising goal in dollars. When set, the progress bar fills toward it.
  # When unset/blank, the goal bar is hidden.
  def goal_amount
    value = ENV['GOAL_AMOUNT']
    value.present? ? value.to_i : nil
  end

  # Optional: only count donations on/after this date toward total_raised.
  # Format: YYYY-MM-DD. Useful to scope the goal bar to the current drive.
  def drive_start_date
    value = ENV['DRIVE_START_DATE']
    value.present? ? Time.zone.parse(value) : nil
  rescue ArgumentError
    nil
  end

  # Optional branding: a logo image URL and an accent (hex) color.
  def station_logo_url
    ENV['STATION_LOGO_URL'].presence
  end

  def accent_color
    ENV.fetch('ACCENT_COLOR', '#F5BD47')
  end

  # Values safe to expose to the browser.
  def client_config
    {
      stationName: station_name,
      logoUrl: station_logo_url,
      accentColor: accent_color
    }
  end
end
