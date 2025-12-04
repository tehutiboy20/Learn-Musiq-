import { useEffect, useRef, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'


function App () {

const audioContextRef = useRef(null);

const noteData = [
{note: "C4", frequency:261.63, key: 'q'}, 
{note: 'C#4',frequency:277.18, key: '2'},
{note: "D4", frequency:293.66, key: 'w'},
{note: "D#4", frequency:311.13, key: '3'},
{note: "E4", frequency:329.63, key: 'e'},
{note: "F4", frequency:349.23, key: 'r'},
{note: "F#4", frequency:369.99, key: '5'}, 
{note: "G4", frequency:392.00, key: 't'}, 
{note: "G#4", frequency:415.30, key: '6'},
{note: "A4", frequency:440.00, key: 'y'},
{note: "A#4", frequency:466.16, key: '7'},
{note: "B4", frequency:493.88, key: 'u'},
{note: "C5", frequency:523.25, key: 'i'},
{note: "C#5", frequency:554.37, key: '9'},
{note: "D5", frequency:587.33, key: 'o'},
{note: "D#5", frequency:622.25, key: '0'},
{note: "E5", frequency:659.25, key: 'p'},
{note: "F5", frequency:698.46, key: 'z'},
{note: "F#5", frequency:739.99, key: 's'},
{note: "G5", frequency:783.99, key: 'x'},
{note: "G#5", frequency:830.61, key: 'd'},
{note: "A5", frequency:880.00, key: 'c'},
{note: "A#5", frequency:932.33, key: 'f'},
{note: "B5", frequency:987.77, key: 'v'},
{note: "C6", frequency:1046.50, key: 'b'},
{note: "C#6", frequency:1108.73, key: 'h'},
{note: "D6", frequency:1174.66, key: 'n'},
{note: "D#6", frequency:1244.51, key: 'j'},
{note: "E6", frequency:1318.51, key: 'm'},
{note: "F6", frequency:1396.91, key: ','},
{note: "F#6", frequency:1479.98, key: 'l'},
{note: "G6", frequency:1567.98, key: '.'},
]

function handleKeyPress(event) {

  //get the presssed key 
const pressedKey = event.key;

// find matching note
const matchedNote = noteData.find((note) => {
// check if the key in the note data matches the pressed key
return note.key === pressedKey

}) 

if(matchedNote) {
  // calling handle play tone  
  handlePlayTone(matchedNote.frequency, 0.5);
}

}
useEffect(() => {
  window.addEventListener('keydown', handleKeyPress);
  
  return () => {
    window.removeEventListener('keydown', handleKeyPress);
  };
}, []);



  // instrument tone generation 
function handlePlayTone (frequency, duration) {


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
    {noteData.map((note) => {
    return <button key={note.note} onClick={() => handlePlayTone(note.frequency, 0.5)}> {note.note}
      </button>
    })}
  </div>
)
}
export default App
