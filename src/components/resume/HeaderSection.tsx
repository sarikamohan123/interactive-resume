export function HeaderSection() {
  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Name</h1>
      <p className="text-xl text-gray-600 mb-4">Software Developer</p>
      <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
        <span>email@example.com</span>
        <span>+1 (555) 123-4567</span>
        <span>City, State</span>
      </div>
    </header>
  )
}