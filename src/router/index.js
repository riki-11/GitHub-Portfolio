/**
 * Module for storing frontend routes.
 * @module router
 */

// Import packages
import { createRouter, createWebHistory } from 'vue-router'
import jwt_decode from 'jwt-decode'
import NProgress from 'nprogress'

// Import view components
import LoginView from '../views/LoginView.vue'
import DashboardMain from '../views/DashboardMain.vue'
import MemberProfilesView from '../views/MemberProfilesView.vue'
import OfficerProfilesView from '../views/OfficerProfilesView.vue'
import NewLoanApplication from '../views/NewLoanAppView.vue'
import MemberSearch from '../components/MemberSearch.vue'
import LoanApplicationForm from '../components/loans/LoanApplicationForm.vue'
import LoanApplicationFormExport from '../components/loans/LoanApplicationFormExport.vue'
import LoanStatus from '../views/LoanStatus.vue'
import DashboardDeposit from '../views/DashboardDeposit.vue'
import LoanLedgerView from '../views/LoanLedgerView.vue'
import LoanTransaction from '../views/LoanTransaction.vue'
import LoanLedgerAdd from '../components/loans/LoanLedgerAdd.vue'
import EnterDeposit from '../views/EnterDeposit.vue'
import DepositAdd from '../components/deposits/DepositAdd.vue'
import DepositLedgerView from '../views/DepositLedgerView.vue'
import MemberView from '../views/MemberView.vue'
import TransactionSettings from '../views/TransactionSettings.vue'
import NotificationSettings from '../views/NotificationSettings.vue'
import AdminSettings from '../views/AdminSettings.vue'

// Disable NProgress spinner
NProgress.configure({ showSpinner: false })

// Import path name constants
import { PATH_NAMES } from '../constants'

/**
 * Frontend routes.
 */
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        /**
         * Login page
         */
        {
            path: '/',
            name: 'Login',
            component: LoginView,
            beforeEnter: (to, from, next) => {
                const credentials = window.$cookies.get('credentials')
                if (credentials && credentials.token) next({ name: 'Loan Dashboard' })
                else next()
            }
        },
        /**
         * Loan dashboard
         */
        {
            path: '/dashboard',
            name: 'Loan Dashboard',
            component: DashboardMain,
            beforeEnter: (to, from, next) => {
                const credentials = window.$cookies.get('credentials')
                if (!credentials || !credentials.token) next({ name: 'Login' })
                else next()
            }
        },
        /**
         * Member profiles list
         */
        {
            path: '/member-profiles',
            name: 'Member Profiles View',
            component: MemberProfilesView,
            beforeEnter: (to, from, next) => {
                const credentials = window.$cookies.get('credentials')
                if (!credentials || !credentials.token) next({ name: 'Login' })
                else next()
            }
        },
        /**
         * Individual member profile view
         */
        {
            path: '/member-profiles/:username',
            name: 'Profile View',
            component: MemberView,
            props: true,
            beforeEnter: (to, from, next) => {
                const credentials = window.$cookies.get('credentials')
                if (!credentials || !credentials.token) next({ name: 'Login' })
                else next()
            }
        },
        /**
         * Officer profile list view
         */
        {
            path: '/officer-profiles',
            name: 'Officer Register',
            component: OfficerProfilesView,
            beforeEnter: (to, from, next) => {
                const credentials = window.$cookies.get('credentials')
                if (!credentials || !credentials.token) next({ name: 'Login' })
                else next()
            }
        },
        /**
         * Loan application form
         */
        {
            path: '/new-loan-application',
            name: 'New Loan Application',
            component: NewLoanApplication,
            children: [
                /**
                 * Default path
                 */
                {
                    path: '',
                    redirect: '/new-loan-application/' + PATH_NAMES.APP_FORM.MEMBER_INPUT
                },
                /**
                 * Loan application form (step 1) - Member search
                 */
                {
                    path: PATH_NAMES.APP_FORM.MEMBER_INPUT,
                    name: 'Loan Application Member Input',
                    component: MemberSearch,
                    props: { to: 'Loan Application Details' }
                },
                /**
                 * Loan application form (step 2) - Application details form
                 */
                {
                    path: PATH_NAMES.APP_FORM.APPLICATION_DETAILS,
                    name: 'Loan Application Details',
                    component: LoanApplicationForm,
                    beforeEnter: (to, from, next) => {
                        // Redirect to member input if `from` is not member input
                        if (from.name !== 'Loan Application Member Input')
                            next({ name: 'Loan Application Member Input' })
                        else next()
                    }
                },
                /**
                 * Loan application form (step 3) - Export to PDF and submit
                 */
                {
                    path: PATH_NAMES.APP_FORM.EXPORT_FORM,
                    name: 'Export Application Form',
                    component: LoanApplicationFormExport,
                    beforeEnter: (to, from, next) => {
                        // Redirect to member input if `from` is not application details
                        if (from.name !== 'Loan Application Details')
                            next({ name: 'Loan Application Member Input' })
                        else next()
                    }
                }
            ],
            beforeEnter: (to, from, next) => {
                const credentials = window.$cookies.get('credentials')
                if (!credentials || !credentials.token) next({ name: 'Login' })
                else next()
            }
        },
        /**
         * Ledger for individual loans.
         */
        {
            path: '/loan-ledger/:id',
            name: 'Loan Ledger',
            component: LoanLedgerView,
            props: true, // allows props to be passed
            beforeEnter: (to, from, next) => {
                const credentials = window.$cookies.get('credentials')
                if (!credentials || !credentials.token) next({ name: 'Login' })
                else next()
            }
        },
        /**
         * Pending and rejected loans view.
         */
        {
            path: '/loan-status',
            name: 'Loan Status',
            component: LoanStatus,
            beforeEnter: (to, from, next) => {
                const credentials = window.$cookies.get('credentials')
                if (!credentials || !credentials.token) next({ name: 'Login' })
                else next()
            }
        },
        /**
         * Page for adding loan transactions (unused)
         */
        {
            path: '/loan-transaction',
            name: 'Loan Transaction',
            component: LoanTransaction,
            children: [
                {
                    path: '',
                    redirect: '/loan-transaction/' + PATH_NAMES.LOAN_TRANSACTIONS.MEMBER_INPUT
                },
                {
                    path: PATH_NAMES.LOAN_TRANSACTIONS.MEMBER_INPUT,
                    name: 'Loan Transaction Member Input',
                    component: MemberSearch,
                    props: { to: 'Loan Transaction Details', canCreateNewMember: false }
                },
                {
                    path: PATH_NAMES.LOAN_TRANSACTIONS.TRANSACTION_DETAILS,
                    name: 'Loan Transaction Details',
                    component: LoanLedgerAdd,
                    beforeEnter: (to, from, next) => {
                        // Redirect to member input if `from` is not member input
                        if (from.name !== 'Loan Transaction Member Input')
                            next({ name: 'Loan Transaction Member Input' })
                        else next()
                    }
                }
            ],
            beforeEnter: (to, from, next) => {
                const credentials = window.$cookies.get('credentials')
                if (!credentials || !credentials.token) next({ name: 'Login' })
                else next()
            }
        },
        /**
         * Deposit dashboard view
         */
        {
            path: '/deposit-dashboard',
            name: 'Deposit Dashboard',
            component: DashboardDeposit,
            beforeEnter: (to, from, next) => {
                const credentials = window.$cookies.get('credentials')
                if (!credentials || !credentials.token) next({ name: 'Login' })
                else next()
            }
        },
        /**
         * Deposit creation form
         */
        {
            path: '/enter-deposit',
            name: 'Enter Deposit',
            component: EnterDeposit,
            children: [
                {
                    path: '',
                    redirect: '/enter-deposit/' + PATH_NAMES.DEPOSIT_TRANSACTIONS.MEMBER_INPUT
                },
                {
                    path: PATH_NAMES.DEPOSIT_TRANSACTIONS.MEMBER_INPUT,
                    name: 'Deposit Transaction Member Input',
                    component: MemberSearch,
                    props: { to: 'Deposit Transaction Details', canCreateNewMember: false }
                },
                {
                    path: PATH_NAMES.DEPOSIT_TRANSACTIONS.TRANSACTION_DETAILS,
                    name: 'Deposit Transaction Details',
                    component: DepositAdd,
                    beforeEnter: (to, from, next) => {
                        // Redirect to member input if `from` is not member input
                        if (from.name !== 'Deposit Transaction Member Input')
                            next({ name: 'Deposit Transaction Member Input' })
                        else next()
                    }
                }
            ],
            beforeEnter: (to, from, next) => {
                const credentials = window.$cookies.get('credentials')
                if (!credentials || !credentials.token) next({ name: 'Login' })
                else next()
            }
        },
        /**
         * Ledger view for individual deposits.
         */
        {
            path: '/deposit-ledger/:id',
            name: 'Deposit Ledger',
            component: DepositLedgerView,
            props: true, // allows props to be passed
            beforeEnter: (to, from, next) => {
                const credentials = window.$cookies.get('credentials')
                if (!credentials || !credentials.token) next({ name: 'Login' })
                else next()
            }
        },
        /**
         * Loan and deposit settings view.
         */
        {
            path: '/settings/loans-and-deposits',
            name: 'Loans and Deposits Settings',
            component: TransactionSettings,
            props: true, // allows props to be passed
            beforeEnter: (to, from, next) => {
                const credentials = window.$cookies.get('credentials')
                if (!credentials || !credentials.token) next({ name: 'Login' })

                const { token } = credentials
                const decoded = jwt_decode(token)
                if (decoded.type !== 'admin') next({ name: 'Loan Dashboard' })
                else next()
            }
        },
        /**
         * Notification settings view.
         */
        {
            path: '/settings/notification',
            name: 'Notification Settings',
            component: NotificationSettings,
            props: true, // allows props to be passed
            beforeEnter: (to, from, next) => {
                const credentials = window.$cookies.get('credentials')
                if (!credentials || !credentials.token) next({ name: 'Login' })

                const { token } = credentials
                const decoded = jwt_decode(token)
                if (decoded.type !== 'admin') next({ name: 'Loan Dashboard' })
                else next()
            }
        },
        /**
         * Administrator settings view (password change screen)
         */
        {
            path: '/settings/admin',
            name: 'Admin Settings',
            component: AdminSettings,
            props: true, // allows props to be passed
            beforeEnter: (to, from, next) => {
                const credentials = window.$cookies.get('credentials')
                if (!credentials || !credentials.token) next({ name: 'Login' })

                const { token } = credentials
                const decoded = jwt_decode(token)
                if (decoded.type !== 'admin') next({ name: 'Loan Dashboard' })
                else next()
            }
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    next()
})

router.afterEach(NProgress.done)

export default router
