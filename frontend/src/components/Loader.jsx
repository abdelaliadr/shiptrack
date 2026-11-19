
export default function Loader({ fullScreen = false }) {
  return (
    <div
      className={`w-full h-1 overflow-hidden ${
        fullScreen ? 'fixed top-0 left-0 z-9999' : ''
      }`}
      role="status"
      aria-label="Loading"
    >
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute h-full w-[35%] rounded-full bg-linear-to-r from-indigo-500 via-indigo-400 to-purple-400 shadow-[0_0_12px_rgba(129,140,248,0.6)] animate-loading" />
      </div>
    </div>
  )
}
