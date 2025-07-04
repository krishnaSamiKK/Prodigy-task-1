import React from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

interface PasswordStrengthProps {
  password: string
}

interface StrengthCriteria {
  label: string
  test: (password: string) => boolean
}

const criteria: StrengthCriteria[] = [
  {
    label: 'At least 8 characters',
    test: (password) => password.length >= 8,
  },
  {
    label: 'Contains uppercase letter',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: 'Contains lowercase letter',
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: 'Contains number',
    test: (password) => /\d/.test(password),
  },
  {
    label: 'Contains special character',
    test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
]

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  if (!password) return null

  const metCriteria = criteria.filter(criterion => criterion.test(password))
  const strengthPercentage = (metCriteria.length / criteria.length) * 100

  const getStrengthColor = (percentage: number) => {
    if (percentage <= 20) return 'bg-red-500'
    if (percentage <= 40) return 'bg-orange-500'
    if (percentage <= 60) return 'bg-yellow-500'
    if (percentage <= 80) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthText = (percentage: number) => {
    if (percentage <= 20) return 'Very Weak'
    if (percentage <= 40) return 'Weak'
    if (percentage <= 60) return 'Fair'
    if (percentage <= 80) return 'Good'
    return 'Strong'
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Password strength:</span>
          <span className={`font-medium ${getStrengthColor(strengthPercentage).replace('bg-', 'text-')}`}>
            {getStrengthText(strengthPercentage)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strengthPercentage)}`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Requirements:</p>
        <div className="space-y-1">
          {criteria.map((criterion, index) => {
            const isMet = criterion.test(password)
            return (
              <div key={index} className="flex items-center space-x-2 text-sm">
                {isMet ? (
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                )}
                <span className={isMet ? 'text-green-700' : 'text-gray-500'}>
                  {criterion.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}