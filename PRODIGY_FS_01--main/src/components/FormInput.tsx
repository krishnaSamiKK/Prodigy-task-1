import React, { useState, forwardRef } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

interface FormInputProps {
  label: string
  type: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  required?: boolean
  showPasswordToggle?: boolean
  disabled?: boolean
  autoComplete?: string
  id?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  showPasswordToggle = false,
  disabled = false,
  autoComplete,
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className="space-y-2">
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200 outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : isFocused
              ? 'border-blue-500 bg-white focus:ring-2 focus:ring-blue-200'
              : 'border-gray-300 bg-gray-50 hover:bg-white hover:border-gray-400'
            }
          `}
          {...props}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      
      {error && (
        <div className="flex items-center space-x-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
})

FormInput.displayName = 'FormInput'