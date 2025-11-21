# Development Plan - Sports Betting Tips Application

## Overview
A minimalist Next.js web application for sports betting tipsters with Supabase backend and Vercel deployment.

## Phase 1: Project Setup & Initial Configuration

### 1.1 Next.js Project Initialization
- [x] Initialize Next.js project with TypeScript
- [x] Configure project structure (app router or pages router)
- [x] Set up ESLint and Prettier
- [x] Configure path aliases (@/components, @/lib, etc.)
- [x] Set up environment variables (.env.local, .env.development)

### 1.2 Supabase Setup
- [x] Install Supabase client libraries (@supabase/supabase-js, @supabase/ssr)
- [x] Create Supabase project (manual step - go to https://app.supabase.com)
- [x] Install Supabase client libraries (@supabase/supabase-js, @supabase/ssr)
- [x] Configure Supabase client initialization
- [x] Set up environment variables for Supabase (URL, anon key, service role key)


### 1.3 UI Framework Setup
- [x] Install and configure Material-UI (MUI) or Tailwind CSS
- [x] Set up MUI DatePicker (@mui/x-date-pickers)
- [x] Configure theme for minimalist design
- [x] Set up responsive layout components

## Phase 2: Database Schema Design

### 2.1 Core Tables
- [x] **users** (extends Supabase auth.users)
  - id (uuid, primary key)
  - email (text)
  - role (enum: 'betting', 'customer')
  - account_active_until (timestamp)
  - created_at (timestamp)
  - updated_at (timestamp)

- [x] **betting_companies**
  - id (uuid, primary key)
  - name (text, unique)
  - created_at (timestamp)

- [x] **sports**
  - id (uuid, primary key)
  - name (text, unique)
  - created_at (timestamp)

- [x] **leagues**
  - id (uuid, primary key)
  - name (text)
  - sport_id (uuid, foreign key to sports)
  - created_at (timestamp)

- [x] **betting_tips**
  - id (uuid, primary key)
  - betting_company_id (uuid, foreign key)
  - sport_id (uuid, foreign key)
  - league_id (uuid, foreign key)
  - match (text)
  - odds (numeric, 1.001 to 2.00)
  - match_date (timestamp)
  - status (enum: 'pending', 'win', 'loss')
  - created_by (uuid, foreign key to users)
  - created_at (timestamp)
  - updated_at (timestamp)

- [x] **user_subscriptions**
  - id (uuid, primary key)
  - user_id (uuid, foreign key to users)
  - month (date)
  - valid_to (timestamp)
  - next_month_free (boolean)
  - created_at (timestamp)

- [x] **marketing_settings**
  - id (uuid, primary key)
  - key (text, unique)
  - value (jsonb)
  - updated_at (timestamp)

### 2.2 Database Policies (RLS)
- [x] Set up Row Level Security (RLS) on all tables
- [x] Create policies for betting role (full access)
- [x] Create policies for customer role (read-only access to active tips)
- [x] Create policies for public access (homepage only)

### 2.3 Database Functions & Triggers
- [x] Function to check if user has active account
- [x] Function to calculate tip success rate by month
- [x] Trigger to automatically set next_month_free based on losing tips
- [x] Function to validate odds range (1.001 to 2.00)

## Phase 3: Authentication System

### 3.1 Supabase Auth Configuration
- [x] Configure email/password authentication
- [x] Set up Google OAuth provider
- [x] Set up Facebook OAuth provider
- [x] Configure OAuth redirect URLs
- [x] Set up email templates (optional)

### 3.2 Authentication Components
- [x] Create login page component
- [x] Create signup page component
- [x] Create social login buttons (Google, Facebook)
- [x] Create authentication context/provider
- [x] Create protected route wrapper (middleware)

### 3.3 User Management
- [x] Create user profile page
- [x] Implement profile update functionality
- [x] Add role-based access control helpers

## Phase 4: Core Application Features

### 4.1 Homepage (/home)
- [x] Create homepage layout
- [x] Add project information section
- [x] Add call-to-action for registration
- [x] Implement responsive design

### 4.2 Betting Tips Page (/bettings)
- [x] Create betting tips list component
- [x] Filter tips by date (current/active)
- [x] Display tips in card/list format
- [x] Show betting company, sport, league, match, odds, date
- [x] Add access control (only active customers)
- [x] Implement pagination or infinite scroll

### 4.3 History Page (/history)
- [x] Create history page layout
- [x] Group tips by month
- [x] Calculate and display success rate per month
- [x] Show win/loss statistics
- [x] Add month selector/filter
- [x] Display percentage success rate

### 4.4 Profile Page (/profile)
- [x] Create profile settings page
- [x] Display user information
- [x] Show account status and expiration date
- [x] Add profile update form
- [x] Display subscription history

## Phase 5: Admin Features (Betting Role)

### 5.1 New Bet Form (/newbet)
- [x] Create form layout
- [x] Add betting company dropdown (from database)
- [x] Add sport dropdown (from database)
- [x] Add league dropdown (filtered by selected sport)
- [x] Add match text input
- [x] Add odds input with validation (1.001-2.00)
- [x] Add date picker (MUI DatePicker, format: dd.mm.YYYY HH:mm)
- [x] Implement form validation
- [x] Add submit handler with Supabase insert
- [x] Add success/error notifications
- [x] Protect route (betting role only)

### 5.2 Betting Tips Management
- [x] Create list of unevaluated bets
- [x] Add filter for pending bets
- [x] Add manual evaluation buttons (Win/Loss)
- [x] Implement status update functionality
- [x] Add confirmation dialog for status changes
- [x] Update tip status in database

### 5.3 Settings Page (/settings)
- [x] Create settings page layout
- [x] **User List Section**
  - Display all registered users
  - Show user email, role, account status
  - Add search/filter functionality
  - Add pagination
- [x] **Account Activation Section**
  - Add date picker for account expiration
  - Update user account_active_until field
  - Bulk update functionality (optional)
- [x] **Betting Companies Management**
  - List all betting companies
  - Add new betting company form
  - Edit existing betting company
  - Delete betting company (with confirmation)
- [x] **Marketing Settings**
  - Create marketing settings form
  - Store settings in marketing_settings table
  - Add settings for free month logic
- [x] **Free Month Logic Settings**
  - Toggle for automatic free month on losing tip
  - Configure rules for free month eligibility
- [x] Protect all settings routes (betting role only)
- [x] this route is accessible only for role betting
- [x] setting link is in navigation bar next to logout from left

## Phase 6: Business Logic Implementation

### 6.1 Subscription Management
- [ ] Create function to check account active status
- [ ] Implement logic to check if user has active account
- [ ] Add middleware to protect customer routes

### 6.2 Free Month Logic
- [ ] Create function to check for losing tips in previous month
- [ ] Implement automatic next_month_free flag setting
- [ ] Create trigger/function to extend account when free month is granted
- [ ] Add manual override in settings

### 6.3 Tip Evaluation
- [ ] Create function to calculate monthly success rate
- [ ] Implement tip status aggregation
- [ ] Add statistics calculation (win rate, total tips, etc.)

## Phase 7: UI/UX Implementation

### 7.1 Design System
- [ ] Define color palette (minimalist)
- [ ] Set up typography scale
- [ ] Create reusable component library
  - Buttons
  - Cards
  - Forms
  - Tables
  - Modals/Dialogs
  - Navigation

### 7.2 Layout Components
- [ ] Create main layout wrapper
- [ ] Create navigation bar/header
- [ ] Add role-based navigation items
- [ ] Create footer (optional)
- [ ] Implement responsive sidebar (if needed)

### 7.3 Styling & Responsiveness
- [ ] Ensure mobile responsiveness
- [ ] Add loading states
- [ ] Add error states
- [ ] Add empty states
- [ ] Implement smooth transitions

## Phase 8: Testing & Quality Assurance

### 8.1 Unit Tests
- [ ] Test utility functions
- [ ] Test business logic functions
- [ ] Test form validations

### 8.2 Integration Tests
- [ ] Test authentication flows
- [ ] Test database operations
- [ ] Test role-based access

### 8.3 E2E Tests (Optional)
- [ ] Test user registration/login
- [ ] Test betting tip creation
- [ ] Test tip evaluation flow

## Phase 9: Deployment

### 9.1 Vercel Configuration
- [ ] Connect GitHub repository to Vercel
- [ ] Configure environment variables in Vercel
- [ ] Set up build configuration
- [ ] Configure custom domain (if needed)

### 9.2 Supabase Production Setup
- [ ] Set up production Supabase project
- [ ] Run migrations in production
- [ ] Configure production OAuth redirect URLs
- [ ] Set up production environment variables

### 9.3 Pre-deployment Checklist
- [ ] Test all features in staging
- [ ] Verify RLS policies
- [ ] Check environment variables
- [ ] Test OAuth providers
- [ ] Verify date formatting
- [ ] Test responsive design on multiple devices

## Phase 10: Post-Deployment

### 10.1 Monitoring
- [ ] Set up error tracking (Sentry or similar)
- [ ] Configure analytics (optional)
- [ ] Monitor Supabase usage

### 10.2 Documentation
- [ ] Create README with setup instructions
- [ ] Document environment variables
- [ ] Document database schema
- [ ] Create user guide (optional)

## Technical Stack Summary

- **Frontend**: Next.js (TypeScript)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email, Google, Facebook)
- **UI Library**: Material-UI (MUI)
- **Date Picker**: MUI X Date Pickers
- **Deployment**: Vercel
- **Styling**: MUI Theme / CSS Modules

## Key Considerations

1. **Security**: Implement proper RLS policies, validate all inputs, sanitize user data
2. **Performance**: Optimize database queries, implement pagination, use caching where appropriate
3. **User Experience**: Clear error messages, loading states, intuitive navigation
4. **Date Handling**: Consistent date formatting (dd.mm.YYYY HH:mm), timezone considerations
5. **Role Management**: Strict role-based access control throughout the application


