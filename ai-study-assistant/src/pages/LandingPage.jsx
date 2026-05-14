import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            StudyMate AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Your personal AI tutor, available 24/7
          </p>
          <Link
            to="/chat"
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Learning
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-100">
            Why Choose StudyMate AI?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800 rounded-2xl p-8 hover:bg-gray-750 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl border border-gray-700">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-3 text-blue-400">Ask Anything</h3>
              <p className="text-gray-300">
                Tanya materi kuliah apapun dan dapatkan jawaban yang mudah dipahami
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800 rounded-2xl p-8 hover:bg-gray-750 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl border border-gray-700">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-3 text-indigo-400">Quiz Mode</h3>
              <p className="text-gray-300">
                Latihan soal otomatis untuk menguji pemahaman Anda
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800 rounded-2xl p-8 hover:bg-gray-750 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl border border-gray-700">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-3 text-purple-400">Summary Mode</h3>
              <p className="text-gray-300">
                Rangkuman materi instan untuk belajar lebih efisien
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p className="text-sm">
            © 2024 StudyMate AI. Built with ❤️ for students everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
