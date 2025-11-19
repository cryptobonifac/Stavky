
# Project Description

simple web application with minimalist design intended for sports betting tipsters
# Web Application Content

/home - homepage with project information
/bettings - current sports betting tips for active customers
/customer profile - profile settings
/newbet - form to add a new betting tip, betting role only
/history - tip evaluations by months with percentage success rate
/settings - application settings, betting role only
- list of registered members
- admin sets the date until which the user has an activated account


## Login via Social Accounts
- gmail
- facebook
- email

## Roles
- betting - site administrator
- customer - customer with active account

## Betting Interface
logged-in user with betting role can add a new BettingTip record with these parameters:
- betting company - dropdown
     - bet365
     - fortuna
     - nike
- sport - e.g. volleyball, handball. Data from database. Dropdown
- league - data from database, dropdown
- match - text
- odds - numeric from 1.001 to 2.00
- match date - date in format dd.mm.YYYY hhhh

### list of bets
- list of unevaluated bets with option for manual evaluation - loss or win
- administrator can set bets to win or lost with a manual trigger

## Tips

user with active account has access to Betting tips on /bettings page
## Settings

marketing settings
user list
settings for users, whether they have the next month free, if there was a losing tip in the previous month.
if in a given month there was a losing tip and the user had active membership, then the next month is free
# Technical Part

database - Supabase
nextjs web application
design - minimalist functional modern design
datepicker https://mui.com/x/react-date-pickers/quickstart/
