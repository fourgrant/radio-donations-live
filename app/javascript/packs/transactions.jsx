import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import ActionCable from 'actioncable'
import MarioCoin from '../sounds/mario_coin.mp3'
import MarioLevelUp from '../sounds/mario_level_up.mp3'
import { differenceInMinutes, formatDistanceToNow, setMinutes, setSeconds, subHours, format } from 'date-fns'

function Logo({width}) {
  return <svg viewBox="0 0 572 571" fill="none" xmlns="http://www.w3.org/2000/svg" className={width + ` h-auto`}><path d="M285.615 0C127.874 0 0 127.804 0 285.459C0 443.113 127.874 570.918 285.615 570.918C443.356 570.918 571.23 443.113 571.23 285.459C571.23 127.804 443.356 0 285.615 0Z" fill="currentColor"/><path fillRule="evenodd" clipRule="evenodd" d="M109.816 227.256C134.903 262.875 159.989 298.494 185.076 334.113C209.766 369.177 234.455 404.225 259.129 439.288C262.811 444.522 262.62 444.03 268.317 444.03C326.376 444.046 384.435 444.046 442.494 444.046C447.096 444.046 451.713 444.046 456.331 444.03C457.108 444.03 457.902 444.046 458.647 443.903C459.996 443.634 460.472 442.746 459.917 441.461C459.584 440.7 459.06 439.986 458.568 439.288C440.574 413.74 422.581 388.223 404.603 362.674C404.143 362.04 403.682 361.39 403.365 360.692C402.778 359.423 403.222 358.535 404.619 358.297C405.602 358.123 406.634 358.155 407.649 358.155C423.596 358.139 439.527 358.139 455.474 358.139C456.569 358.139 457.664 358.155 458.743 357.949C459.996 357.727 460.456 356.87 459.964 355.697C459.615 354.84 459.044 354.063 458.505 353.302C432.625 316.811 406.745 280.304 380.865 243.813C356.826 209.906 332.755 176.048 308.811 142.11C306.7 139.113 304.384 137.86 300.671 137.876C285.089 137.939 269.491 137.955 253.909 137.955C238.311 137.955 222.729 137.939 207.132 137.939C175.873 137.939 144.614 137.939 113.371 137.955C112.196 137.955 111.006 137.907 109.864 138.05C108.198 138.272 107.722 139.24 108.436 140.699C108.753 141.333 109.182 141.904 109.578 142.475C114.577 149.548 119.591 156.621 124.605 163.694C137.299 181.598 149.993 199.487 162.687 217.392C163.226 218.153 163.782 218.93 164.178 219.771C164.765 221.055 164.321 221.896 162.909 222.134C161.909 222.292 160.878 222.261 159.862 222.261C144.169 222.276 128.445 222.261 112.752 222.276C111.816 222.276 110.864 222.229 109.943 222.356C108.119 222.578 107.611 223.482 108.42 225.083C108.801 225.845 109.309 226.542 109.816 227.256Z" fill="#373537"/><path d="M285.616 333.035C259.326 333.035 238.013 311.734 238.013 285.458C238.013 259.183 259.326 237.882 285.616 237.882C311.906 237.882 333.218 259.183 333.218 285.458C333.218 311.734 311.906 333.035 285.616 333.035Z" fill="currentColor"/></svg>
}
function Icon({name}) {
  if (name === 'speaker') {
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.114 5.63601C19.9497 6.47174 20.6127 7.4639 21.065 8.55583C21.5173 9.64777 21.7501 10.8181 21.7501 12C21.7501 13.1819 21.5173 14.3522 21.065 15.4442C20.6127 16.5361 19.9497 17.5283 19.114 18.364M16.463 8.28801C17.4474 9.27255 18.0004 10.6078 18.0004 12C18.0004 13.3922 17.4474 14.7275 16.463 15.712M6.75 8.25001L11.47 3.53001C11.5749 3.42525 11.7085 3.35393 11.8539 3.32504C11.9993 3.29616 12.15 3.31101 12.2869 3.36772C12.4239 3.42443 12.541 3.52046 12.6234 3.64368C12.7058 3.76689 12.7499 3.91177 12.75 4.06001V19.94C12.7499 20.0883 12.7058 20.2331 12.6234 20.3563C12.541 20.4796 12.4239 20.5756 12.2869 20.6323C12.15 20.689 11.9993 20.7039 11.8539 20.675C11.7085 20.6461 11.5749 20.5748 11.47 20.47L6.75 15.75H4.51C3.63 15.75 2.806 15.243 2.572 14.396C2.35752 13.6154 2.24922 12.8095 2.25 12C2.25 11.17 2.362 10.367 2.572 9.60401C2.806 8.75601 3.63 8.25001 4.51 8.25001H6.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  }
}
function Wrapper(props) {
  const cable = ActionCable.createConsumer(`wss://${window.location.hostname}/cable`)
  return <Transactions cable={cable} />
}

function centsToDollars(cents) {
  return (cents / 100).toLocaleString("en-US", {style:"currency", currency:"USD"});
}

const playSound = (sound) => {
  const audio = new Audio(sound)
  audio.volume = 1
  audio.play()
}

function ThemeFab({ availableThemes, selectedTheme, onThemeChange }) {
  const [open, setOpen] = useState(false)
  const fabRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      const idx = availableThemes.indexOf(selectedTheme)
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        onThemeChange(availableThemes[(idx - 1 + availableThemes.length) % availableThemes.length])
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        onThemeChange(availableThemes[(idx + 1) % availableThemes.length])
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, selectedTheme, availableThemes, onThemeChange])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (fabRef.current && !fabRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={fabRef} className="fixed bottom-4 right-4 z-50 flex flex-col-reverse items-end gap-2">
      <button
        className="btn btn-circle btn-lg bg-neutral text-neutral-content shadow-xl border-2 border-base-300"
        onClick={() => setOpen(!open)}
        aria-label="Theme switcher"
        title="Theme switcher (arrow keys to cycle)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>
      {open && (
        <div className="flex flex-col gap-1 max-h-[70vh] overflow-y-auto rounded-box bg-base-200 border border-base-content/20 shadow-xl p-2 w-48">
          <div className="text-xs uppercase tracking-wide text-base-content/50 px-2 py-1">Theme <span className="text-base-content/30">(arrow keys)</span></div>
          {availableThemes.map((t) => (
            <button
              key={t}
              className={`btn btn-sm btn-ghost justify-start font-medium ${t === selectedTheme ? 'btn-active' : ''}`}
              onClick={() => { onThemeChange(t); setOpen(false) }}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Transactions(props) {
  const THEME_STORAGE_KEY = 'radio-donations-theme'
  const DEFAULT_THEME = 'dracula'
  const stationConfig = (typeof window !== 'undefined' && window.STATION_CONFIG) || {}
  const stationName = stationConfig.stationName || 'Community Radio'
  const logoUrl = stationConfig.logoUrl
  const accentColor = stationConfig.accentColor || '#F5BD47'
  const [transactions, setTransactions] = useState([])
  const [channel, setChannel] = useState(null)
  const [myTime, setMyTime] = useState(new Date())
  const [goalPercentage, setGoalPercentage] = useState(null)
  const [goalConfigured, setGoalConfigured] = useState(false)
  const [soundActivated, setSoundActivated] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState(DEFAULT_THEME)
  const availableThemes = [
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
  ]

  const handleNewTransaction = useRef(null);
  handleNewTransaction.current = (transaction) => {
    if (!transactions.find(t => t.transaction_id === transaction.transaction_id)) {
      const updatedTransactions = [ ...[transaction], ...transactions]
      setTransactions(updatedTransactions)
      playSound(MarioCoin)

      // refetch the full list, since the broadcast payload omits custom fields
      getTransactions()
    }
  }

  const handleRefreshTransactions = useRef(null);
  handleRefreshTransactions.current = () => {
    getTransactions()
  }

  // Goal progress is computed from total_raised / goal_amount returned by the
  // API. When goal_amount is unset, the bar is hidden.
  const updateGoal = useRef(null);
  updateGoal.current = (data) => {
    const goalAmount = data.goal_amount
    if (!goalAmount) {
      setGoalConfigured(false)
      return
    }
    setGoalConfigured(true)
    const raisedDollars = (data.total_raised || 0) / 100
    const newGoalPercentage = Math.round((raisedDollars / goalAmount) * 100)

    if (goalPercentage !== null && newGoalPercentage > parseInt(goalPercentage, 10)) {
      playSound(MarioLevelUp)
    }
    setGoalPercentage(newGoalPercentage)
  }

  const getTransactions = () => {
    fetch('/transactions.json')
      .then(response => response.json())
      .then(data => {
        syncTransactions.current(data.transactions)
        updateGoal.current(data)
      })
  }

  const syncTransactions = useRef(null)
  syncTransactions.current = (fetchedTransactions) => {
    const newTransactions = {}
    for (const t of [...transactions]) {
      newTransactions[t.transaction_id] = t
    }
    let transactionsWereAdded = false
    for (const t of fetchedTransactions) {
      if (!newTransactions[t.transaction_id]) {
        transactionsWereAdded = true
      }
      newTransactions[t.transaction_id] = t
    }

    const sortedTransactions = Object.values(newTransactions).sort((a,b) => {
      return new Date(b.created_at) - new Date(a.created_at)
    })
    setTransactions(sortedTransactions)
    if (transactionsWereAdded) { playSound(MarioCoin) }
  }

  const updateTransaction = (transaction) => {
    const newTransactions = [...transactions]
    const i = newTransactions.findIndex(t => t.id === transaction.id)
    newTransactions[i] = transaction
    setTransactions(newTransactions)
  }

  const applyTheme = (rawTheme) => {
    const nextTheme = availableThemes.includes(rawTheme) ? rawTheme : DEFAULT_THEME
    setSelectedTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    document.body.setAttribute('data-theme', nextTheme)
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    applyTheme(savedTheme || DEFAULT_THEME)

    getTransactions()

    const channel = props.cable.subscriptions.create(
      { channel: 'TransactionsChannel' },
      {
        received: (data) => {
          if (data == 'refresh') {
            handleRefreshTransactions.current()
          } else {
            handleNewTransaction.current(data)
          }
        },
      }
    )

    setChannel(channel)
    var timerID = setInterval(() => {
      setMyTime(new Date())
    }, 1000 * 60);

    var transactionTimer = setInterval(() => {
      getTransactions()
    }, 1000 * 60 * 1)

    return () => {
      channel.unsubscribe()
      clearInterval(timerID)
      clearInterval(transactionTimer)
    }
  },[handleNewTransaction])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedTheme)
    document.body.setAttribute('data-theme', selectedTheme)
  }, [selectedTheme])

  console.log('transactions', transactions)

  const handleSoundActivation = () => {
    playSound(MarioCoin)
    setSoundActivated(true)
    // reset sound activation after 3 seconds
    setTimeout(() => setSoundActivated(false) , 1000)
  }
  let top_margin = '20px'
  return <div data-theme={selectedTheme} className="min-h-screen bg-base text-base-content lg:pt-30">
    <ThemeFab availableThemes={availableThemes} selectedTheme={selectedTheme} onThemeChange={applyTheme} />
    <div className="hidden lg:block fixed top-0 left-0 right-0 z-40 h-20 bg-base-100"></div>
    <header className="navbar bg-base-100 px-6 lg:py-4 grid grid-cols-12 lg:flex gap-6 items-center m-6 border-b-2 border-base-300 max-w-screen-2xl mx-auto lg:fixed top-0 left-0 right-0 z-50 flex-wrap lg:flex-nowrap">
      <div className=" col-span-12 lg:w-auto text-base flex items-center gap-4 justify-center lg:justify-start">
        {logoUrl
          ? <img src={logoUrl} alt={stationName} className="w-16 h-auto" />
          : <span style={{ color: accentColor }}><Logo width="w-16" /></span>}
        <h2 className="text-xl lg:text-2xl font-bold my-0 text-base-content whitespace-nowrap">{stationName} Donations Stream</h2>
      </div>
      {goalConfigured && (
        <div className="col-span-7 sm:col-span-8 lg:w-auto lg:flex-grow">
          <p className="text-base text-base-content/60 font-bold mb-2 sr-only">Fundraiser Goal</p>
          <div className="relative w-full h-10">
            <div className="top-0 left-0 absolute border-success bg-base-200/50 border rounded-field w-full h-10" />
              <div style={{ width: `${Math.min(goalPercentage || 0, 100)}%` }} className="top-[4px] left-[4px] absolute flex justify-center items-center bg-success rounded-field h-[32px] font-bold text-success-content text-center leading-[34px]"> {goalPercentage || 0}% </div>
          </div>
        </div>
      )}
      <div className="col-span-5 sm:col-span-4 lg:w-auto whitespace-nowrap"> 
        <button className="btn btn lg:btn-lg btn-secondary w-full lg:w-72  " onClick={handleSoundActivation}>
          <Icon name='speaker' />
          {soundActivated ? 'Ca-ching!' : 'Activate Sound'}
        </button>
      </div>
    </header>
    <div className={`flex flex-col gap-4 w-full items-center px-4 lg:px-12 pt-96 ${soundActivated ? 'cha-ching' : ''}`} style={{ paddingTop: `${top_margin}` }}>
      <div className="p-4 overflow-scroll flex justify-center flex-col gap-8 w-full max-w-3xl mx-auto bg-base-200 text-base-content rounded-box"> 
        {/* <div>
          <p className={`text-base text-base-700 font-bold mb-2`}>Latest Donation</p>
          {transactions[0] && <div style={styles.newTransaction}><Transaction transaction={transactions[0]} updateTransaction={updateTransaction} embiggen /></div>}
        </div> */}
        {/* <hr className={`border-base-800/20`} /> */}
        
        <TransactionTotals transactions={transactions} /> {/* TODO: add a total amount raised */}

      </div>

      <div className="card border border-base-300 border-2 rounded-box overflow-scroll divide-y-2 divide-base-300 w-full max-w-6xl mx-auto">
        {transactions.map(transaction => <div key={transaction.id} className={``}>
            <Transaction transaction={transaction} updateTransaction={updateTransaction} />
          </div>
        )}
      </div>
    </div>
  </div>
}

function CheckBox ({checked}) {
  return <input
    type="checkbox"
    className={`checkbox checkbox-xl pointer-events-none mt-1 border-2! ${checked ? 'checkbox-neutral opacity-50' : 'checkbox-primary'}`}
    checked={checked}
    readOnly
    aria-hidden="true"
  />
}

function Transaction({transaction, updateTransaction, embiggen}) {
  const handleUpdateTransaction = () => {
    const body = { transaction: { id: transaction.id, completed: !transaction.completed } }
    fetch(`/transactions/${transaction.id}.json`, { method: 'PUT', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }})
      .then(response => response.json())
      .then(data => updateTransaction(data.transaction))
  }

  const createdAt = new Date(Date.parse(transaction.created_at))
  const minutesAgo = differenceInMinutes(createdAt, new Date())

  let style
  if (transaction.completed) {
    style = styles.completed
  } else {
    style = minutesAgo >= -15 ? styles.recent : {}
  }
  if (transaction.transaction_type == 'recurring') {
    style = { ...style, ...styles.recurring }
  }
  let amt = centsToDollars(transaction.amount_in_cents).replace('$', '').split('.')
  let amount_dollar = amt[0]
  let amount_cents = amt[1]
  let recurring = transaction.transaction_type == 'recurring'
  let campaignChipTheme = 'badge-primary'
  function MakeNote({label, note}) {
    return <>
      <div className={`text-sm bg-base-200/50 p-4 rounded-box ${transaction.completed ? `text-base-content/50` : `text-base-content`}`}>
        <span className={`font-bold block ${transaction.completed ? `text-base-content/20` : `text-base-content/50`}`}>{label}: </span>
        <span className={`text-lg font-mono ${transaction.completed ? 'text-base-content/50' : 'text-base-content/90'}`}>{note}</span>
      </div>
    </>
  }
  return <>
    <button
      className={`
        flex justify-between w-full gap-4 cursor-pointer group text-left relative
        ${embiggen ? '' : 'hover:bg-base-200/20 p-6 '}
        ${recurring && 'pt-10'}
      `} onClick={handleUpdateTransaction}>

      {recurring && <>
        <div className={`
          inline-flex justify-center items-center gap-2 absolute w-full top-2 left-0 right-0 text-center
          ${transaction.completed ? 'text-base-content/40' : 'text-base-content animate-pulse'}
        `}>
          <span className={`
            text-base whitespace-nowrap [&>i]:inline-block [&>i]:not-italic inline-flex gap-2
            ${transaction.completed ? 'opacity-50' : '[&>i]:animate-spin [&>i]:duration-1000'}
            `}><i>🎸</i><i>🥁</i><i>🎹</i></span>
          <span className={`
            whitespace-nowrap font-bold uppercase
            ${embiggen ? 'text-xl' : ' p-2 text-base-content'}
          `}>Recurring Donation</span>
          <span className={`
            text-base whitespace-nowrap [&>i]:inline-block [&>i]:not-italic inline-flex gap-2
            ${transaction.completed ? 'opacity-50' : '[&>i]:animate-spin [&>i]:duration-1000'}
            `}><i>🎺</i><i>🎷</i><i>🪕</i></span>
        </div>
      </>}

      <CheckBox checked={transaction.completed ? true : false} />
      <div className="flex flex-col gap-2 w-full px-4">
        <div className={`
          mt-0 
          ${transaction.completed ? 'text-base-content/40 line-through' : 'text-base-content'}
          ${embiggen ? 'text-6xl line-clamp-3 font-bold' : 'text-4xl'}
        `}>{transaction.anonymous ? 'Anonymous Donor' : `${transaction.first_name} ${transaction.last_name}`}</div>
        <div className={`
          badge inline-flex font-bold self-start pt-0.5
          ${campaignChipTheme}
          ${transaction.completed ? `!bg-neutral-content/50 !text-neutral/50` : null}
        `}>{transaction.campaign_name}</div>
        <div className={`text-sm ${transaction.completed ? `text-base-content/40` : `text-base-content/70`}`}>
          <span className={`font-bold ${transaction.completed ? `text-base-content/40` : `text-base-content`}`}>
            {formatDistanceToNow(createdAt)} ago</span> - <span>{createdAt.toLocaleString()}
          </span>
        </div>
        {transaction.donation_fields_json && transaction.donation_fields_json.length > 0
          ? transaction.donation_fields_json.map((field, idx) => {
              const answer = (field.answer || field.value || '').replace(/&#39;/g, "'")
              if (!answer) return null
              const question = (field.question || field.name || '').toLowerCase()
              if (question.includes('100% of your gift') || question.includes('select your gift')) return null
              return <MakeNote key={idx} label={field.question || field.name || 'Note'} note={answer} />
            })
          : <>
              {transaction.note && <MakeNote label="Shoutout" note={transaction.note} /> }
              {transaction.custom_field_value1 && <MakeNote label="Custom Field" note={transaction.custom_field_value1.replace('&#39;', "'")} /> }
            </>
        }
      </div>
      <div className={`text-5xl font-semibold ${transaction.completed ? `text-base-content/40` : `text-base-content`}`}>
        <div className="inline-flex gap-1">
          <span className="text-base">$</span>
          <span className="-mt-1">{amount_dollar}</span>
          <span className="text-base underline underline-offset-2">
            <span className="sr-only">.</span>
            {amount_cents}
          </span>
        </div>
      </div>
    </button>
  </>
}

function TransactionTotals({transactions}) {
  const currentHour = setSeconds(setMinutes(new Date(), 0), 0)
  const oneHourAgo = subHours(currentHour, 1)
  const twoHoursAgo = subHours(currentHour, 2)
  const threeHoursAgo = subHours(currentHour, 3)
  const fourHoursAgo = subHours(currentHour, 4)

  const transactionsThisHour = transactions.filter(t => new Date(t.created_at) >= currentHour)
  const transactionsOneHourAgo = transactions.filter(t => new Date(t.created_at) < currentHour && new Date(t.created_at) >= oneHourAgo)
  const transactionsTwoHoursAgo = transactions.filter(t => new Date(t.created_at) < oneHourAgo && new Date(t.created_at) >= twoHoursAgo)
  const transactionsThreeHoursAgo = transactions.filter(t => new Date(t.created_at) < twoHoursAgo && new Date(t.created_at) >= threeHoursAgo)
  const transactionsFourHoursAgo = transactions.filter(t => new Date(t.created_at) < threeHoursAgo && new Date(t.created_at) >= fourHoursAgo)

  const transactionSum = (transactions) => {
    return centsToDollars(transactions.reduce((n, {amount_in_cents}) => n + amount_in_cents, 0))
  }
  const FormatRow = ({col1, col2, col3, embiggen}) => {
    return <>
      <div className={`flex justify-start gap-6 items-baseline py-2 ${embiggen ? 'border-b-2 border-base-300' : ''}`}>
        <div className={`flex-shrink-0 flex-grow-0 w-64 font-bold ${embiggen ? ' ' : '  '}`}>{col1}</div>
        <div className={`flex-shrink-0 flex-grow-0 w-auto flex items-center gap-1.5 ${embiggen ? 'text-base  font-bold' : ''}`}>
          {col2} 
          <span className={``}> donations raised </span> 
          {col3}
          <span className={``}>
            {embiggen ? ' this hour ' : ' last hour '}
          </span>
        </div>
      </div>
    </>
  }

  return <>
    <div className={`flex flex-col divide-y divide-neutral-content/20 px-8`}>
      <FormatRow
        col1={`${format(currentHour, 'hbbb').replace('12midnight','Midnight')} - Now`}
        col2={transactionsThisHour.length}
        col3={transactionSum(transactionsThisHour)}
        embiggen />
      <FormatRow
        col1={`${format(oneHourAgo, 'hbbb')} - ${format(currentHour, 'hbbb')}`}
        col2={transactionsOneHourAgo.length}
        col3={transactionSum(transactionsOneHourAgo)} />
      {/* <FormatRow
        col1={`${format(twoHoursAgo, 'hbbb')} - ${format(oneHourAgo, 'hbbb')}`}
        col2={transactionsTwoHoursAgo.length}
        col3={transactionSum(transactionsTwoHoursAgo)} />
      <FormatRow
        col1={`${format(threeHoursAgo, 'hbbb')} - ${format(twoHoursAgo, 'hbbb')}`}
        col2={transactionsThreeHoursAgo.length}
        col3={transactionSum(transactionsThreeHoursAgo)} />
      <FormatRow
        col1={`${format(fourHoursAgo, 'hbbb')} - ${format(threeHoursAgo, 'hbbb')}`}
        col2={transactionsFourHoursAgo.length}
        col3={transactionSum(transactionsFourHoursAgo)} /> */}
    </div>
  </>
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Wrapper />,
    document.body.appendChild(document.createElement('div')),
  )
})

const styles = {
  newTransaction: {
    fontSize: '40px'
  },
  recent: {
    color: '#09aaba'
  },
  completed: {
    color: '#707070',
    textDecoration: 'line-through'
  },
  recurring: {
    backgroundColor: '#4c2656',
    padding: '10px'
  }
}