import { Navigate, Route, Routes } from 'react-router-dom'
import { RoleSelectPage } from '../pages/RoleSelectPage'
import { UserDashboard } from '../pages/user/UserDashboard'
import { GuardianDashboard } from '../pages/guardian/GuardianDashboard'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelectPage />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/guardian" element={<GuardianDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
