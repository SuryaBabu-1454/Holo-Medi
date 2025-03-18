// import { useState } from "react";
// import { IoMdFemale, IoMdMale } from "react-icons/io";
// import Title from "../components/Title";
// import backgroundImage from '../assets/background/b1.png';

// export default function BmiCalculator() {
//   const [screen, setScreen] = useState("main"); // Default screen is 'main'
//   const [gender, setGender] = useState(null);
//   const [height, setHeight] = useState("");
//   const [weight, setWeight] = useState(50);
//   const [age, setAge] = useState(18);
//   const [bmi, setBmi] = useState(null);
//   const [bmiCategory, setBmiCategory] = useState("");
//   const [error, setError] = useState("");

//   const handleHeightChange = (e) => {
//     const value = e.target.value;
//     if (value < 50 || value > 250) {
//       setError("Height must be between 50cm and 250cm.");
//     } else {
//       setError("");
//     }
//     setHeight(value);
//   };

//   const handleWeightChange = (change) => {
//     const newWeight = weight + change;
//     if (newWeight < 1 || newWeight > 300) {
//       setError("Weight must be between 1kg and 300kg.");
//     } else {
//       setError("");
//       setWeight(newWeight);
//     }
//   };

//   const handleAgeChange = (change) => {
//     const newAge = age + change;
//     if (newAge < 1 || newAge > 120) {
//       setError("Age must be between 1 and 120.");
//     } else {
//       setError("");
//       setAge(newAge);
//     }
//   };

//   const calculateBmi = () => {
//     if (!height || height < 50 || height > 250) {
//       setError("Please enter a valid height between 50cm and 250cm.");
//       return;
//     }
//     if (weight < 1 || weight > 300) {
//       setError("Please enter a valid weight between 1kg and 300kg.");
//       return;
//     }
//     if (age < 1 || age > 120) {
//       setError("Please enter a valid age between 1 and 120.");
//       return;
//     }

//     const heightInMeters = height / 100;
//     const calculatedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

//     setBmi(calculatedBmi);

//     if (calculatedBmi < 18.5) setBmiCategory("Underweight");
//     else if (calculatedBmi < 24.9) setBmiCategory("Normal weight");
//     else if (calculatedBmi < 29.9) setBmiCategory("Overweight");
//     else setBmiCategory("Obese");

//     setScreen("result");
//     setError("");
//   };

//   return (
//     <div
//       className="h-screen bg-cover bg-center flex flex-col px-5 py-3 overflow-y-auto md:overflow-y-visible pb-24 sm:pb-24 md:pb-0" // Added scrollbar for xs/sm and pb-24
//       style={{ backgroundImage: `url(${backgroundImage})` }}
//     >
//       {/* Header */}
//       <Title name={"BMI Calculator"} />

//       {/* Main Content */}
//       <div className="flex-1 flex items-center justify-center">
//         <div className="w-full max-w-lg flex flex-col items-center justify-center">
//           {/* Input Screen */}
//           {screen === "main" && (
//             <div className="space-y-4 bg-zinc-900 lg:p-6 p-4 w-full rounded-lg">
//               <h2 className="text-lg font-bold text-cyan-400">BMI Calculator</h2>

//               {/* Gender Selection */}
//               <div className="grid grid-cols-2 gap-2">
//                 <div
//                   onClick={() => setGender("male")}
//                   className={`flex justify-center items-center p-4 rounded-lg text-white font-semibold text-center cursor-pointer ${
//                     gender === "male" ? "bg-cyan-800" : "bg-zinc-800"
//                   }`}
//                 >
//                   <IoMdMale size={30} />
//                   <span className="ml-2">Male</span>
//                 </div>

//                 <div
//                   onClick={() => setGender("female")}
//                   className={`flex justify-center items-center p-4 rounded-lg text-white font-semibold text-center cursor-pointer ${
//                     gender === "female" ? "bg-cyan-800" : "bg-zinc-800"
//                   }`}
//                 >
//                   <IoMdFemale size={30} />
//                   <span className="ml-2">Female</span>
//                 </div>
//               </div>

//               {/* Height Input */}
//               <div className="rounded-xl bg-zinc-800 px-5 py-3">
//                 <label className="mb-2 block text-sm font-semibold text-cyan-200/60">
//                   Height
//                 </label>
//                 <div className="flex items-center">
//                   <input
//                     type="number"
//                     value={height}
//                     onChange={handleHeightChange}
//                     className="w-full bg-transparent text-3xl font-semibold text-white outline-none"
//                     placeholder="175"
//                     min="50"
//                     max="250"
//                   />
//                   <span className="ml-2 text-cyan-300">cm</span>
//                 </div>
//               </div>

//               {/* Weight and Age Inputs */}
//               <div className="grid grid-cols-2 gap-2">
//                 <div className="flex flex-col items-center gap-2 rounded-xl bg-zinc-800 p-2">
//                   <label className="mb-2 block text-center text-gray-200">
//                     Weight
//                   </label>
//                   <div className="flex items-center justify-between">
//                     <button
//                       onClick={() => handleWeightChange(-1)}
//                       className="rounded-md bg-cyan-300 px-3 pb-1 text-xl font-bold"
//                     >
//                       -
//                     </button>
//                     <input
//                       type="number"
//                       value={weight}
//                       readOnly
//                       className="w-16 bg-transparent text-center text-4xl font-bold text-white outline-none"
//                     />
//                     <button
//                       onClick={() => handleWeightChange(1)}
//                       className="rounded-md bg-cyan-300 px-2 pb-1 text-xl font-bold"
//                     >
//                       +
//                     </button>
//                   </div>
//                   <span className="mt-2 block text-center text-sm font-semibold text-neutral-400">
//                     kg
//                   </span>
//                 </div>
//                 <div className="flex flex-col justify-between rounded-xl bg-zinc-800 p-2">
//                   <label className="mb-2 block text-center text-gray-200">
//                     Age
//                   </label>
//                   <div className="flex items-center justify-center">
//                     <button
//                       onClick={() => handleAgeChange(-1)}
//                       className="rounded-md bg-cyan-300 px-3 pb-1 text-xl font-bold"
//                     >
//                       -
//                     </button>
//                     <input
//                       type="number"
//                       value={age}
//                       readOnly
//                       className="w-16 bg-transparent text-center text-4xl font-bold text-white outline-none"
//                     />
//                     <button
//                       onClick={() => handleAgeChange(1)}
//                       className="rounded-md bg-cyan-300 px-2 pb-1 text-xl font-bold"
//                     >
//                       +
//                     </button>
//                   </div>
//                   <span className="mt-2 block text-center text-sm font-semibold text-neutral-400">
//                     Year
//                   </span>
//                 </div>
//               </div>

//               {/* Error Message */}
//               {error && (
//                 <p className="text-red-500 text-sm text-center">{error}</p>
//               )}

//               {/* Calculate Button */}
//               <button
//                 onClick={calculateBmi}
//                 className="bg-cyan-900 text-white font-semibold p-3 rounded-lg w-full mt-4"
//               >
//                 Calculate BMI
//               </button>
//             </div>
//           )}

//           {/* Result Screen */}
//           {screen === "result" && (
//             <div className="rounded-xl bg-zinc-900 lg:p-6 p-4 w-full flex flex-col justify-center items-center space-y-4">
//               <h2 className="text-lg font-bold text-cyan-300">Your BMI Result</h2>

//               <div className="bg-cyan-800/50 p-6 rounded-lg text-center">
//                 <h1 className="text-3xl font-bold text-white">{bmi}</h1>
//                 <p className="text-gray-300 text-lg">{bmiCategory}</p>
//               </div>

//               <button
//                 onClick={() => setScreen("main")}
//                 className="bg-cyan-900 text-white font-semibold p-3 rounded-lg w-full"
//               >
//                 Recalculate
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }