import './App.css';
import Cookies from 'js-cookie';
import OnboardingScreen from './components/onboardingScreen.jsx';
import { CircleX, Github, MapPinPlus, Ruler } from "lucide-react";
import MapComponent from './components/map.tsx'
import ContextMenu from './components/contextMenu.tsx'
import AnimatedNumber from './components/animatedNumber.tsx'
import { useEffect, useState } from 'react';


function App() {
  // Define the menu options in GROUPS
  const iconSize = 16;

  const [clickPosition, setClickPosition] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [distanceMarkers, setDistanceMarkers] = useState([]);
  const [lines, setLines] = useState([]);
  const [distance, setDistance] = useState(0);
  const [finalDistance, setFinalDistance] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(null); // New state to lock start point

  const [submenuVisible, setSubmenuVisible] = useState({ submenuLabel: String, visible: Boolean });
  const [showDistanceCalculationContainer, setShowDistanceCalculationContainer] = useState(false);
  const [visibilityCloseDistanceContainer, setVisibilityCloseDistanceContainer] = useState(false);

  const menuOptions = [
    {
      groupName: "Measurements",
      items: [
        {
          icon: <MapPinPlus size={iconSize} />, label: "Add Marker", action: () => {
            if (clickPosition) {
              setMarkers([...markers, { lat: clickPosition.lat, lng: clickPosition.lng }]);
            }
          }
        }, {
          icon: <Ruler size={iconSize} />, label: "Measure Distance",


          action: () => {
            if (clickPosition && hoverPosition) {
              setLines([]);
              setConfirmEnd(false); // just to give it the beginning value, to have the useEffect Function be able to work and get out of the default state
              setFinalDistance(0); // Reset final distance
              setShowDistanceCalculationContainer(true);
              setDistanceMarkers([{ lat: clickPosition.lat, lng: clickPosition.lng }]);
            }
          }
        },
        // {
        //   icon: <DraftingCompass size={iconSize} />, label: "Measure Area", action: () => setSubmenuVisible({ submenuLabel: "Measure Area", visible: true }), submenu: {
        //     groupName: "Measure Area",
        //     items: [
        //       { icon: <CircleDashed size={iconSize} />, label: "Circular", action: () => alert("Option 3 selected") },
        //       { icon: <SquareDashed size={iconSize} />, label: "Rectangular", action: () => alert("Option 4 selected") },
        //       { icon: <ScissorsLineDashed size={iconSize} />, label: "Freeform", action: () => alert("Option 5 selected") },
        //       { icon: <Pencil size={iconSize} />, label: "Nodes", action: () => alert("Option 6 selected") },
        //     ]
        //   }
        // },
      ]
    }, {
      groupName: "Links",
      items: [
        { icon: <Github size={iconSize} />, label: "View the Repo", action: () => window.location = "https://github.com/SimonGubitz/react-map/" },
      ]
    }
  ];


  useEffect(() => {
    if (clickPosition && hoverPosition) {
      if (confirmEnd !== null && confirmEnd === false) {
        // Draw the line
        const newLine = [[clickPosition.lat, clickPosition.lng], [hoverPosition.lat, hoverPosition.lng]];
        setLines([newLine]);
      } else if (confirmEnd !== null && confirmEnd === true) {
        if (distanceMarkers.length < 2) {
          setDistanceMarkers((prevMarkers) => [...prevMarkers, { lat: hoverPosition.lat, lng: hoverPosition.lng }]);
        }
        setVisibilityCloseDistanceContainer(true);
      }
    }
  }, [hoverPosition, clickPosition, confirmEnd]);

  useEffect(() => {
    const popupShown = Cookies.get('popupShown');
    if (!popupShown) {
      setShowPopup(true);
    }
  }, []);

  const handleClosePopup = () => {
    Cookies.set('popupShown', 'true', { expires: 30 }); // Expires in 30 days
    setShowPopup(false);
  };

  return (
    <div className="App rounded-md w-full min-h-screen">


      {showPopup && <OnboardingScreen onClose={handleClosePopup} />}



      <ContextMenu className="rounded-md" menuGroups={menuOptions} submenuVisible={submenuVisible} setSubmenuVisible={setSubmenuVisible} >
        <MapComponent confirmEnd={confirmEnd} setConfirmEnd={setConfirmEnd} distance={distance} clickPosition={clickPosition} customMarkers={markers} customDistanceMarkers={distanceMarkers} customLines={lines} setClickPosition={setClickPosition} setHoverPosition={setHoverPosition} setCustomMarkers={setMarkers} setDistance={setDistance} setFinalDistance={setFinalDistance} />
      </ContextMenu>


      {showDistanceCalculationContainer && (
        <div className="fixed bottom-2 inset-x-1/2 w-max py-4 px-8 bg-stone-900 drop-shadow-lg text-white rounded-lg z-[500]">
          <button id="stop-distance-calculation"
            onClick={() => {
              // Hide the distance calculation container
              setShowDistanceCalculationContainer(false);

              // Clear distance markers, lines, and positions to reset the measurement
              setDistanceMarkers([]);
              setLines([]);
              setDistance(0);
              setFinalDistance(0);
              setVisibilityCloseDistanceContainer(false);

              // Reset click and hover positions to prevent extra markers
              setClickPosition(null);
              setHoverPosition(null);
              setConfirmEnd(null);
            }}
            className="absolute top-2 right-2 text-white hover:text-sky-700">
            <CircleX size={iconSize} />
          </button>

          <h2>Distance Calculation: </h2>
          <div>
            <AnimatedNumber value={finalDistance > 0 ? finalDistance : distance} />
            <span>m</span>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;