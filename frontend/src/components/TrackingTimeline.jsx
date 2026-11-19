import { STATUS_COLORS } from '../constants/shipmentStatus'

export default function TrackingTimeline({ events }) {
  // Backend sends oldest first; copy + reverse so the newest is on top
  const items = [...events].reverse()

  return (
    <ol>
      {items.map((event, index) => {
        const isLatest = index === 0
        const isLast = index === items.length - 1

        return (
          <li key={`${event.status}-${event.createdAt}`} className="flex gap-4">
            {/* Dot + connecting line */}
            <div className="flex flex-col items-center">
              <span
                className={`shrink-0 rounded-full ${
                  isLatest
                    ? 'w-5 h-5 ring-4 ring-brand-soft'
                    : 'w-3.5 h-3.5 mt-1'
                }`}
                style={{ backgroundColor: STATUS_COLORS[event.status] }}
              />
              {!isLast && <span className="w-0.5 flex-1 bg-line my-1" />}
            </div>

            {/* Event details */}
            <div className="pb-6">
              <p className={isLatest ? 'font-bold' : 'font-semibold'}>
                {event.status.replaceAll('_', ' ')}
              </p>
              {event.location && (
                <p className="text-sm text-muted">{event.location}</p>
              )}
              {event.note && <p className="text-sm text-muted">{event.note}</p>}
              <p className="text-xs text-muted mt-1">
                {new Date(event.createdAt).toLocaleString()}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}