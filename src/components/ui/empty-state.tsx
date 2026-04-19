interface EmptyStateProps {
  message: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ message, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-muted-foreground">
        <h3 className="text-lg font-medium">{message}</h3>
        {description && (
          <p className="text-sm mt-1">{description}</p>
        )}
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}