import { Mouse, Cookie, LaptopMinimal } from "lucide-react";


function OnboardingScreen({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex justify-center items-center z-[1000]">
      
      <div className="border-solid border border-slate-500 bg-zinc-900 rounded-xl p-6 max-w-sm w-4/6 text-center text-gray-400">

        <h2 className="text-2xl font-semibold mb-2 text-white">Welcome!</h2>

        <div className="flex flex-row justify-center align-center">
          <LaptopMinimal size={20} />
          <p className="max-w-prose w-11/12 mb-6">For the best experience, please use this app on a desktop computer, as it's not optimized for mobile devices.</p>
        </div>
        <div className="flex flex-row justify-center align-center">
          <Mouse size={20} />
          <p className="max-w-prose w-11/12 mb-6">Right-click to start adding markers and measuring distances.</p>
        </div>
        <div className="flex flex-row justify-center align-center">
          <Cookie size={20} />
          <p className="max-w-prose w-11/12 mb-6">This app uses cookies to remember your settings.</p>
        </div>


        <button onClick={onClose} className="bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded-md hover:bg-blue-700 w-5/6">
          Got it!
        </button>
      </div>
    </div>
  );
}

export default OnboardingScreen;