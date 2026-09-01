import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/25 active:scale-95":
            variant === "primary",
          "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700":
            variant === "secondary",
          "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950":
            variant === "outline",
          "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800":
            variant === "ghost",
          "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/25 active:scale-95":
            variant === "danger",
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
          "cursor-wait": loading,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!loading && icon}
      {children}
    </button>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({
  className,
  label,
  error,
  icon,
  type = "text",
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm",
            "placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
            "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500",
            "transition-all duration-200",
            icon && "pl-10",
            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
            "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card rounded-2xl p-6 transition-all duration-300",
        hover && "hover:shadow-xl hover:-translate-y-1 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

export function StatCard({ title, value, icon, trend, color = "blue" }: StatCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    green: "from-emerald-500 to-teal-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
    purple: "from-purple-500 to-pink-500 text-purple-600 bg-purple-50 dark:bg-purple-900/20",
    orange: "from-orange-500 to-amber-500 text-orange-600 bg-orange-50 dark:bg-orange-900/20",
    red: "from-red-500 to-rose-500 text-red-600 bg-red-50 dark:bg-red-900/20",
  };

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 mt-2 text-sm font-medium",
                trend.isPositive ? "text-emerald-600" : "text-red-600"
              )}
            >
              <span>{trend.isPositive ? "+" : "-"}{trend.value}%</span>
              <span className="text-gray-500 font-normal">from last month</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl bg-gradient-to-br", colorClasses[color])}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({ className, variant = "rectangular" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-gray-700",
        variant === "text" && "h-4 rounded",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-xl",
        className
      )}
    />
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500 text-white font-medium overflow-hidden",
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      role="status"
      aria-label="Loading"
    >
      <svg
        className="animate-spin text-primary-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={size}
        height={size}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}
