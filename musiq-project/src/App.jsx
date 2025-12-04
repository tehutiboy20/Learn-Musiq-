import { useEffect, useRef, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'


function App () {

const audioContextRef = useRef(null);
const activeOscillatorsRef = useRef(new Map())
const [pressedKey, setPressedKey] = useState(null);
const [showKeyboardGuide, setShowKeyboardGuide] = useState(false);

const noteData = [
{note: "C4", frequency:261.63, key: 'q', isBlack:false}, 
{note: 'C#4',frequency:277.18, key: '2', isBlack:true},
{note: "D4", frequency:293.66, key: 'w',isBlack:false},
{note: "D#4", frequency:311.13, key: '3',isBlack:true},
{note: "E4", frequency:329.63, key: 'e',isBlack:false},
{note: "F4", frequency:349.23, key: 'r',isBlack:false},
{note: "F#4", frequency:369.99, key: '5',isBlack:true}, 
{note: "G4", frequency:392.00, key: 't',isBlack:false}, 
{note: "G#4", frequency:415.30, key: '6',isBlack:true},
{note: "A4", frequency:440.00, key: 'y',isBlack:false},
{note: "A#4", frequency:466.16, key: '7',isBlack:true},
{note: "B4", frequency:493.88, key: 'u',isBlack:false},
{note: "C5", frequency:523.25, key: 'i',isBlack:false},
{note: "C#5", frequency:554.37, key: '9',isBlack:true},
{note: "D5", frequency:587.33, key: 'o',isBlack:false},
{note: "D#5", frequency:622.25, key: '0',isBlack:true},
{note: "E5", frequency:659.25, key: 'p',isBlack:false},
{note: "F5", frequency:698.46, key: 'z',isBlack:false},
{note: "F#5", frequency:739.99, key: 's',isBlack:true},
{note: "G5", frequency:783.99, key: 'x',isBlack:false},
{note: "G#5", frequency:830.61, key: 'd',isBlack:true},
{note: "A5", frequency:880.00, key: 'c',isBlack:false},
{note: "A#5", frequency:932.33, key: 'f',isBlack:true},
{note: "B5", frequency:987.77, key: 'v',isBlack:false},
{note: "C6", frequency:1046.50, key: 'b',isBlack:false},
{note: "C#6", frequency:1108.73, key: 'h',isBlack:true},
{note: "D6", frequency:1174.66, key: 'n',isBlack:false},
{note: "D#6", frequency:1244.51, key: 'j',isBlack:true},
{note: "E6", frequency:1318.51, key: 'm',isBlack:false},
{note: "F6", frequency:1396.91, key: ',',isBlack:false},
{note: "F#6", frequency:1479.98, key: 'l',isBlack:true},
{note: "G6", frequency:1567.98, key: '.',isBlack:false},
]


function startNote(frequency, noteName) {
  // Step 1: Check if already playing (prevent duplicates)
  if (activeOscillatorsRef.current.has(noteName)) {
    return; // Don't create another one
  }
  
  // Step 2: Create/get audio context
  if (audioContextRef.current === null) {
    audioContextRef.current = new AudioContext();
  }
  const audioContext = audioContextRef.current;
  
  // Step 3: Create oscillator
  const oscillator = audioContext.createOscillator();
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = 'sine';
  
  // Step 4: Create gain node (for volume control)
  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // 30% volume
  
  // Step 5: Connect the chain: oscillator → gainNode → destination
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Step 6: Start the oscillator
  oscillator.start();
  
  // Step 7: Store in Map for later
  activeOscillatorsRef.current.set(noteName, { oscillator, gainNode });
  
  // Step 8: Visual feedback
  setPressedKey(noteName);
}



function stopNote(noteName) {
  // Check if this note is playing
  if (!activeOscillatorsRef.current.has(noteName)) {
    return;
  }
  
  // Get the stored oscillator and gain node
  const { oscillator, gainNode } = activeOscillatorsRef.current.get(noteName);
  
  // Stop the oscillator
  oscillator.stop();
  
  // Disconnect to clean up
  gainNode.disconnect();
  oscillator.disconnect();
  
  // Remove from Map
  activeOscillatorsRef.current.delete(noteName);
  
  // Clear visual feedback
  setPressedKey(null);
}



function handleKeyPress(event) {
  // Prevent auto-repeat
  if (event.repeat) return;
  
  const pressedKey = event.key;
  const matchedNote = noteData.find((note) => note.key === pressedKey);
  
  if (matchedNote) {
    startNote(matchedNote.frequency, matchedNote.note);
  }
}

function handleKeyRelease(event) {
  const releasedKey = event.key;
  const matchedNote = noteData.find((note) => note.key === releasedKey);
  
  if (matchedNote) {
    stopNote(matchedNote.note);
  }
}

useEffect(() => {
  window.addEventListener('keydown', handleKeyPress);
  window.addEventListener('keyup', handleKeyRelease); // Add this!
  
  return () => {
    window.removeEventListener('keydown', handleKeyPress);
    window.removeEventListener('keyup', handleKeyRelease); // Clean up!
  };
}, []);



  // instrument tone generation 
function handlePlayTone (frequency, duration, noteName) {

  setPressedKey(noteName);

  setTimeout(() => {
    setPressedKey(null);
  }, duration * 1000);

 // check if the audiocontext box is empty  
if (audioContextRef.current === null) {
  audioContextRef.current = new AudioContext()
} 

// now use whats in the box 
const audioContext = audioContextRef.current

const oscillator = audioContext.createOscillator()

//  
oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
oscillator.type = 'sine';

oscillator.connect (audioContext.destination);

oscillator.start(0)

oscillator.stop(audioContext.currentTime + duration); 



}
return (
  <div>
    {/* Toggle button */}
    <button 
      className="toggle-guide-btn"
      onClick={() => setShowKeyboardGuide(!showKeyboardGuide)}
    >
      {showKeyboardGuide ? 'Hide' : 'Show'} Keyboard Guide
    </button>

    {/* Piano */}
    <div className='piano-container'>
      {noteData.map((note) => {
      return <button 
        className={
          `${note.isBlack ? 'black-key' : 'white-key'} 
           ${pressedKey === note.note ? 
             (note.isBlack ? 'black-key-pressed' : 'white-key-pressed') 
             : ''}`
        }
        key={note.note} 
        onMouseDown={() => startNote(note.frequency, note.note)}
        onMouseUp={() => stopNote(note.note)}
      >
        {note.note}
      </button>
      })}
    </div>

    {/* Keyboard Guide (only shows if toggled on) */}
    {showKeyboardGuide && (
      <div className="keyboard-guide">
        {/* Top row - Numbers (black keys) */}
        <div className="keyboard-row">
          {noteData
            .filter(note => ['2', '3', '5', '6', '7', '9', '0'].includes(note.key))
            .map((note) => (
              <div 
                key={note.note}
                className={`guide-key 
                  ${note.note.includes('#') ? 'guide-key-sharp' : ''} 
                  ${pressedKey === note.note ? 'guide-key-active' : ''}`}
              >
                <div className="guide-keyboard-key">{note.key}</div>
                <div className="guide-note-name">{note.note}</div>
              </div>
            ))}
        </div>

        {/* Second row - QWERTY (white keys) */}
        <div className="keyboard-row">
          {noteData
            .filter(note => ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].includes(note.key))
            .map((note) => (
              <div 
                key={note.note}
                className={`guide-key 
                  ${note.note.includes('#') ? 'guide-key-sharp' : ''} 
                  ${pressedKey === note.note ? 'guide-key-active' : ''}`}
              >
                <div className="guide-keyboard-key">{note.key}</div>
                <div className="guide-note-name">{note.note}</div>
              </div>
            ))}
        </div>

        {/* Third row - ASDF (continuation) */}
        <div className="keyboard-row">
          {noteData
            .filter(note => ['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm'].includes(note.key))
            .map((note) => (
              <div 
                key={note.note}
                className={`guide-key 
                  ${note.note.includes('#') ? 'guide-key-sharp' : ''} 
                  ${pressedKey === note.note ? 'guide-key-active' : ''}`}
              >
                <div className="guide-keyboard-key">{note.key}</div>
                <div className="guide-note-name">{note.note}</div>
              </div>
            ))}
        </div>
      </div>
    )}
  </div>
)
}
export default App
