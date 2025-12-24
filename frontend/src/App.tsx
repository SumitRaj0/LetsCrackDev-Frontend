import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { useChatbot } from '@/contexts/ChatbotContext'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoute'

// Lazy load pages for code-splitting
const Home = lazy(() => import('@/pages/Home'))
const Resources = lazy(() => import('@/pages/Resources'))
const ResourceDetail = lazy(() => import('@/pages/ResourceDetail'))
const Categories = lazy(() => import('@/pages/Categories'))
const Courses = lazy(() => import('@/pages/Courses'))
const CourseDetail = lazy(() => import('@/pages/CourseDetail'))
const CourseViewer = lazy(() => import('@/pages/CourseViewer'))
const Premium = lazy(() => import('@/pages/Premium'))
const PremiumBenefits = lazy(() => import('@/pages/PremiumBenefits'))
const PremiumCheckout = lazy(() => import('@/pages/PremiumCheckout'))
const PremiumCourseDetail = lazy(() => import('@/pages/PremiumCourseDetail'))
const PremiumServiceDetail = lazy(() => import('@/pages/PremiumServiceDetail'))
const PaymentSuccess = lazy(() => import('@/pages/PaymentSuccess'))
const PaymentFailed = lazy(() => import('@/pages/PaymentFailed'))
const Login = lazy(() => import('@/pages/Login'))
const Signup = lazy(() => import('@/pages/Signup'))
const SignupSuccess = lazy(() => import('@/pages/SignupSuccess'))
const LoginSuccess = lazy(() => import('@/pages/LoginSuccess'))
const Forgot = lazy(() => import('@/pages/Forgot'))
const ResetPassword = lazy(() => import('@/pages/ResetPassword'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Saved = lazy(() => import('@/pages/Saved'))
const DashboardCourses = lazy(() => import('@/pages/DashboardCourses'))
const Profile = lazy(() => import('@/pages/Profile'))
const UserProfile = lazy(() => import('@/pages/UserProfile'))
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminResources = lazy(() => import('@/pages/admin/Resources'))
const AdminEditResource = lazy(() => import('@/pages/admin/EditResource'))
const AdminCategories = lazy(() => import('@/pages/admin/Categories'))
const AdminUsers = lazy(() => import('@/pages/admin/Users'))
const AdminCourses = lazy(() => import('@/pages/admin/Courses'))
const About = lazy(() => import('@/pages/About'))
const Blog = lazy(() => import('@/pages/Blog'))
const Careers = lazy(() => import('@/pages/Careers'))
const Contact = lazy(() => import('@/pages/Contact'))
const ChatbotDrawer = lazy(() =>
  import('@/components/chatbot/ChatbotDrawer').then(m => ({
    default: m.ChatbotDrawer,
  }))
)

function AppContent() {
  const { isOpen, width: chatbotWidth, toggleChatbot, closeChatbot } = useChatbot()

  // Keyboard shortcut: Ctrl/Cmd + K to toggle chatbot
  useKeyboardShortcut({
    key: 'k',
    ctrlKey: true,
    metaKey: true, // Works with both Ctrl and Cmd
    callback: toggleChatbot,
    enabled: true,
  })

  return (
    <>
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col bg-app-gradient dark:bg-gray-900 transition-colors">
          <div
            className="flex-1 flex"
            style={{
              marginRight: isOpen ? `${chatbotWidth}px` : '0px',
              transition: 'margin-right 0.1s ease-out',
            }}
          >
            <div className="flex-1 flex flex-col min-w-0">
              <Navbar />
              <main className="flex-grow">
                <Suspense fallback={<LoadingSpinner fullScreen showText />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/resources/:id" element={<ResourceDetail />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:id" element={<CourseDetail />} />
                    <Route path="/courses/:id/view" element={<CourseViewer />} />
                    <Route path="/premium" element={<Premium />} />
                    <Route path="/premium/benefits" element={<PremiumBenefits />} />
                    <Route path="/premium/checkout" element={<ProtectedRoute><PremiumCheckout /></ProtectedRoute>} />
                    <Route path="/premium/course/:id" element={<PremiumCourseDetail />} />
                    <Route path="/premium/service/:id" element={<PremiumServiceDetail />} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/cancel" element={<PaymentFailed />} />
                    <Route path="/payment/failed" element={<PaymentFailed />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/login/success" element={<LoginSuccess />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/signup/success" element={<SignupSuccess />} />
                    <Route path="/forgot" element={<Forgot />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/dashboard/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
                    <Route path="/dashboard/courses" element={<ProtectedRoute><DashboardCourses /></ProtectedRoute>} />
                    <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                    <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
                    <Route path="/admin/resources" element={<AdminProtectedRoute><AdminResources /></AdminProtectedRoute>} />
                    <Route path="/admin/resources/new" element={<AdminProtectedRoute><AdminEditResource /></AdminProtectedRoute>} />
                    <Route path="/admin/resources/:id/edit" element={<AdminProtectedRoute><AdminEditResource /></AdminProtectedRoute>} />
                    <Route path="/admin/categories" element={<AdminProtectedRoute><AdminCategories /></AdminProtectedRoute>} />
                    <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
                    <Route path="/admin/courses" element={<AdminProtectedRoute><AdminCourses /></AdminProtectedRoute>} />
                    <Route path="/about" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </div>
        </div>
      </ErrorBoundary>

      {/* Global Chatbot Drawer - only load when opened to keep initial bundle light */}
      {isOpen && (
        <Suspense fallback={null}>
          <ChatbotDrawer isOpen={isOpen} onClose={closeChatbot} />
        </Suspense>
      )}
    </>
  )
}

function App() {
  return <AppContent />
}

export default App
