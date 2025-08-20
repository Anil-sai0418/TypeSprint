import Navigation from './components/ui/Navagation';
import { useNavigate } from 'react-router-dom';

export default function Anil() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex flex-col">
            <Navigation />
            <div className="flex-grow flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-10 py-8 space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
                    Welcome to <span className="text-green-500">Task Manager</span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-700">
                    Organize your tasks in an ordered way
                </p>
                <button
                  onClick={() => navigate('/home')}
                  className="bg-green-500 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full shadow-md hover:bg-green-600 transition duration-200"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
}