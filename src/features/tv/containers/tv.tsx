// import { useSchool } from '@/features/schools';
// import axios from 'axios';
// import {
//   Activity,
//   BookCopy,
//   Calendar,
//   Clock,
//   Cloud,
//   CloudDrizzle,
//   CloudFog,
//   CloudLightning,
//   CloudRain,
//   CloudSun,
//   Library,
//   LogIn,
//   Newspaper,
//   Palette,
//   Sun,
//   Users,
//   Youtube
// } from 'lucide-react';
// import { useCallback, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import YouTube from 'react-youtube';
// import { QRCodeSVG } from 'qrcode.react';

// const BASE_URL = "https://be-perpus.kiraproject.id";

// const TVLayer = () => {
//   const [stats, setStats] = useState({ totalKunjungan: 0, masihDiDalam: 0, totalGuru: 0, totalSiswa: 0 });
//   const [collection, setCollection] = useState({ totalBiblio: 0, totalEksemplar: 0, totalSerial: 0 });
//   const [videoList, setVideoList] = useState<string[]>([]);
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [sholatTimes, setSholatTimes] = useState<any>(null);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [weather, setWeather] = useState({ temp: 31, description: 'Memuat...', iconCode: 0 });

//   const navigate = useNavigate()
  
//   const schoolQuery = useSchool();
//   const SCHOOL_ID = schoolQuery?.data?.[0]?.id;
  
//   const getYoutubeId = (url: string) => {
//     if (!url) return null;
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return (match && match[2].length === 11) ? match[2] : null;
//   };

//   useEffect(() => {
//     // Ambil data dari localStorage
//     const token = localStorage.getItem('token');
//     const user = localStorage.getItem('user');
//     const userProfile = localStorage.getItem('user_profile');

//     // Jika salah satu kosong/tidak ada, redirect ke login
//     if (!token || !user || !userProfile || user === 'null' || user === 'undefined') {
//       navigate('/auth/login');
//     }
//   }, [navigate]);

//   const fetchSholatTimes = async () => {
//     try {
//       const res = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
//         params: { city: 'Jakarta', country: 'Indonesia', method: 11 }
//       });
//       if (res.data.code === 200) setSholatTimes(res.data.data.timings);
//     } catch (err) { console.error(err); }
//   };

//   const fetchData = useCallback(async () => {
//     if (!SCHOOL_ID) return;
//     try {
//       const resStats = await axios.get(`${BASE_URL}/peminjam/report?schoolId=${SCHOOL_ID}&limit=1`);
//       const [resBiblio, resEksemplar, resSerial] = await Promise.all([
//         axios.get(`${BASE_URL}/biblio?schoolId=${SCHOOL_ID}&limit=1`),
//         axios.get(`${BASE_URL}/eksemplar?schoolId=${SCHOOL_ID}&limit=1`),
//         axios.get(`${BASE_URL}/serial/subscriptions?schoolId=${SCHOOL_ID}`)
//       ]);
//       if (resStats.data.success) setStats(resStats.data.summary);
//       setCollection({
//         totalBiblio: resBiblio.data.meta?.totalItems || 0,
//         totalEksemplar: resEksemplar.data.meta?.totalItems || 0,
//         totalSerial: resSerial.data.success ? resSerial.data.data.length : 0
//       });
//       const resSetting = await axios.get(`${BASE_URL}/setting?schoolId=${SCHOOL_ID}`);
//       if (resSetting.data.success) {
//         const { urlYoutube1, urlYoutube2, urlYoutube3 } = resSetting.data.data;
//         const ids = [urlYoutube1, urlYoutube2, urlYoutube3]
//           .map(url => getYoutubeId(url))
//           .filter((id): id is string => id !== null);
//         setVideoList(ids);
//       }
//     } catch (err) { console.error(err); }
//   }, [SCHOOL_ID]);

//   const fetchWeather = async () => {
//     try {
//       // Koordinat Jakarta: -6.2088, 106.8456
//       const res = await axios.get('https://api.open-meteo.com/v1/forecast', {
//         params: {
//           latitude: -6.2088,
//           longitude: 106.8456,
//           current: 'temperature_2m,weather_code',
//           timezone: 'Asia/Jakarta'
//         }
//       });
      
//       if (res.data.current) {
//         const code = res.data.current.weather_code;
//         // Mapping sederhana WMO Code ke deskripsi Bahasa Indonesia
//         const descriptions: Record<number, string> = {
//           0: 'Cerah', 1: 'Cerah Berawan', 2: 'Berawan', 3: 'Mendung',
//           45: 'Kabut', 48: 'Kabut Berembun', 51: 'Gerimis Ringan',
//           61: 'Hujan Ringan', 63: 'Hujan Sedang', 65: 'Hujan Lebat',
//           80: 'Hujan Showers', 95: 'Badai Petir'
//         };

//         setWeather({
//           temp: Math.round(res.data.current.temperature_2m),
//           description: descriptions[code] || 'Cerah Berawan',
//           iconCode: code
//         });
//       }
//     } catch (err) { console.error("Gagal ambil cuaca:", err); }
//   };

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     fetchData();
//     fetchSholatTimes();
//     fetchWeather(); // Panggil fungsi cuaca
//     const dataInterval = setInterval(() => {
//       fetchData();
//       fetchWeather(); // Update cuaca setiap menit
//     }, 60000);
//     return () => { clearInterval(timer); clearInterval(dataInterval); };
//   }, [fetchData]);

//   const getWeatherIcon = (code: number) => {
//     if (code === 0) return <Sun size={40} className="md:w-12 md:h-12 text-yellow-300 drop-shadow-lg" />;
//     if (code >= 1 && code <= 3) return <CloudSun size={40} className="md:w-12 md:h-12 text-yellow-200 drop-shadow-lg" />;
//     if (code >= 45 && code <= 48) return <CloudFog size={40} className="md:w-12 md:h-12 text-slate-300 drop-shadow-lg" />;
//     if (code >= 51 && code <= 55) return <CloudDrizzle size={40} className="md:w-12 md:h-12 text-blue-200 drop-shadow-lg" />;
//     if (code >= 61 && code <= 67) return <CloudRain size={40} className="md:w-12 md:h-12 text-blue-300 drop-shadow-lg" />;
//     if (code >= 80 && code <= 82) return <CloudRain size={40} className="md:w-12 md:h-12 text-blue-400 drop-shadow-lg" />;
//     if (code >= 95) return <CloudLightning size={40} className="md:w-12 md:h-12 text-yellow-400 drop-shadow-lg" />;
//     return <Cloud size={40} className="md:w-12 md:h-12 text-white drop-shadow-lg" />;
//   };

//   const themeClass = isDarkMode 
//     ? "bg-[#020617] text-slate-200" 
//     : "bg-white text-slate-800";
  
//   const cardClass = isDarkMode
//     ? "bg-slate-900/50 border-slate-800 text-white"
//     : "bg-white/70 border-blue-500 text-slate-800";

//   return (
//     <div className={`relative md:fixed md:inset-0 w-screen min-h-screen md:h-screen overflow-auto md:overflow-hidden font-sans p-0 select-none flex flex-col box-border transition-colors duration-500 ${themeClass}`}>
      
//       <style dangerouslySetInnerHTML={{ __html: `
//         @keyframes blob {
//           0% { transform: translate(0px, 0px) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//           100% { transform: translate(0px, 0px) scale(1); }
//         }
//         .animate-blob {
//           animation: blob 15s infinite alternate cubic-bezier(0.45, 0, 0.55, 1);
//         }
//       `}} />

//       <div className={`absolute top-[-10%] left-[-4%] w-[100%] h-[60%] rounded-none blur-[140px] z-0 animate-blob transition-colors duration-1000 ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-400 opacity-90'}`}></div>

//       <div className="flex flex-col md:grid md:grid-cols-12 gap-0 h-max overflow-auto md:h-full min-h-0 relative z-10">
        
//         {/* LEFT COLUMN - Header & Stats */}
//         <div className="md:col-span-3 flex flex-col gap-0 min-h-0 order-1 md:order-none">
//           <div className="bg-purple-700 p-6 md:p-8 border-b md:border-r border-white text-white shadow-2xl relative overflow-hidden shrink-0">
//             <div className="relative z-10">
//               <p className="text-[10px] font-bold flex items-center gap-3 uppercase tracking-widest text-blue-100 mb-1"><Clock size={14} /> Digital Time</p>
//               <div className="flex items-center justify-between">
//                 <h2 className="text-4xl md:text-6xl -ml-1 font-black text-white tracking-tighter tabular-nums leading-none">
//                   {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
//                 </h2>
//                 <Clock size={32} className="md:w-11 md:h-11 text-yellow-300 drop-shadow-lg" />
//               </div>
//               <p className="text-[10px] md:text-xs font-bold mt-3 md:mt-4 flex items-center gap-3 opacity-90 uppercase tracking-widest">
//                 <Calendar size={14} />
//                 {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
//               </p>
//             </div>
//           </div>

//           <div className={`${cardClass} border flex-1 min-h-0 backdrop-blur-2xl flex flex-col justify-between shadow-lg`}>
//              <CompactStat theme={isDarkMode} label="Kunjungan" value={stats.totalKunjungan} icon={<Users size={20}/>} bgColor="bg-emerald-200 text-emerald-700" />
//              <CompactStat theme={isDarkMode} label="Siswa Aktif" value={stats.totalSiswa} icon={<LogIn size={20}/>} bgColor="bg-purple-200 text-blue-700" />
//              <CompactStat theme={isDarkMode} label="Di Dalam" value={stats.masihDiDalam} icon={<Activity size={20}/>} bgColor="bg-rose-200 text-rose-700" />

//               {/* Tambahan QR Code section – ukuran kecil agar muat */}
//               <div className={`p-4 md:p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
//                 <p className={`text-xs md:text-sm font-bold uppercase tracking-wider mb-3 text-center ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
//                   Scan untuk Kunjungan / Pulang
//                 </p>
                
//                 <div className="grid grid-cols-2 gap-4 md:gap-6">
//                   {/* QR Kunjungan / Masuk */}
//                   <div className="flex flex-col items-center">
//                     <div className={`p-2 md:p-3 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`}>
//                       <QRCodeSVG
//                         value="https://be-perpus.kiraproject.id/kehadiran?mode=masuk&schoolId=XXX"
//                         // Ganti value di atas dengan URL asli yang di-scan akan memanggil endpoint kehadiran mode MASUK
//                         size={isDarkMode ? 110 : 120}
//                         bgColor={isDarkMode ? "#1e293b" : "#ffffff"}
//                         fgColor={isDarkMode ? "#60a5fa" : "#2563eb"}
//                         level="Q" // tahan error correction lebih baik
//                       />
//                     </div>
//                     <span className={`mt-2 text-xs font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
//                       MASUK / KUNJUNGAN
//                     </span>
//                   </div>

//                   {/* QR Pulang / Keluar */}
//                   <div className="flex flex-col items-center">
//                     <div className={`p-2 md:p-3 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`}>
//                       <QRCodeSVG
//                         value="https://be-perpus.kiraproject.id/kehadiran?mode=pulang&schoolId=XXX"
//                         // Ganti value di atas dengan URL asli yang di-scan akan memanggil endpoint kehadiran mode PULANG
//                         size={isDarkMode ? 110 : 120}
//                         bgColor={isDarkMode ? "#1e293b" : "#ffffff"}
//                         fgColor={isDarkMode ? "#f87171" : "#dc2626"}
//                         level="Q"
//                       />
//                     </div>
//                     <span className={`mt-2 text-xs font-semibold ${isDarkMode ? 'text-rose-400' : 'text-rose-700'}`}>
//                       PULANG / KELUAR
//                     </span>
//                   </div>
//                 </div>
//               </div>
//           </div>
//         </div>

//         {/* MIDDLE COLUMN - Video & Collection */}
//         <div className="md:col-span-6 flex flex-col gap-0 min-h-0 order-3 md:order-none">
//           <div className="aspect-video md:flex-[2.5] bg-white rounded-none overflow-hidden relative min-h-0 group">
//             <div className='w-full absolute top-0 bg-indigo-700 border-b border-white h-max flex items-center justify-center left-0 z-[9999]'>
//               <div className='w-[100%] overflow-hidden top-0 z-[99999] flex items-center'>
//                 <div className="flex w-full">
//                   {videoList.map((_, i) => (
//                     <button 
//                       key={i}
//                       onClick={() => setCurrentVideoIndex(i)}
//                       className={`px-2 md:px-4 flex items-center justify-center border-none outline-none text-center py-2 h-[40px] md:h-[57px] w-full font-black text-[10px] md:text-xs transition-all bg-purple-700 text-white`}
//                     >
//                       <p className={`${currentVideoIndex === i ? 'bg-white flex items-center justify-center text-blue-700 px-2 py-1 text-center w-[98%] h-[98%]' : ''} relative top-[-1px] flex items-center gap-1 md:gap-2`}>
//                         <Youtube size={16} />
//                         VID {i + 1}
//                       </p>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="absolute bottom-[0px] left-1/2 -translate-x-1/2 z-[999] flex gap-4">
//               <button 
//                 title='Change theme'
//                 onClick={() => setIsDarkMode(!isDarkMode)}
//                 className="p-2 rounded-full bg-purple-700 active:scale-[0.92] border-white flex items-center justify-center h-max text-white border-4 hover:bg-purple-900 transition-all"
//               >
//                 <Palette size={16} />
//               </button>
//             </div>

//             <div className={`hidden md:block w-full absolute bottom-0 ${isDarkMode ? 'bg-slate-900' : 'bg-white'} h-[20px] z-[88]`}></div>

//              {videoList.length > 0 ? (
//                 <YoutubeRotator videoIds={videoList} currentIndex={currentVideoIndex} setIndex={setCurrentVideoIndex} />
//              ) : (
//                <div className="h-full w-full flex items-center justify-center bg-slate-900">
//                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//                </div>
//              )}
//           </div>

//           <div className="relative flex-1 grid grid-cols-3 gap-0 min-h-0 border-y md:border-none">
//             <CollectionCard theme={isDarkMode} label="Katalog" value={collection.totalBiblio} icon={<Library size={24}/>} />
//             <CollectionCard theme={isDarkMode} label="Fisik" value={collection.totalEksemplar} icon={<BookCopy size={24}/>} />
//             <CollectionCard theme={isDarkMode} label="Serial" value={collection.totalSerial} icon={<Newspaper size={24}/>} />
//           </div>
//         </div>

//         {/* RIGHT COLUMN - Weather & Pray Times */}
//         <div className="md:col-span-3 flex flex-col gap-0 min-h-0 order-2 md:order-none">
//           <div className="bg-purple-700 p-6 md:p-8 border-b md:border-l md:border-b-0 border-white text-white shadow-2xl relative overflow-hidden shrink-0">
//             <div className="relative z-10">
//               <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100 mb-1">Jakarta, ID</p>
//               <div className="flex items-center justify-between">
//                 <h4 className="text-4xl md:text-6xl font-black text-white tracking-tighter tabular-nums leading-none">
//                   {weather.temp}°C
//                 </h4>
//                 {getWeatherIcon(weather.iconCode)}
//               </div>
//               <p className="text-[10px] md:text-xs font-bold mt-3 md:mt-4 opacity-90 uppercase tracking-widest">
//                 {weather.description}
//               </p>
//             </div>
//           </div>

//           <div className={`${cardClass} border flex-1 backdrop-blur-xl flex flex-col min-h-0 shadow-lg`}>
//             <div className="flex-1 flex flex-col justify-between min-h-0">
//              {sholatTimes ? (
//                 [
//                   { display: 'Subuh', key: 'Fajr' },
//                   { display: 'Dzuhur', key: 'Dhuhr' },
//                   { display: 'Ashar', key: 'Asr' },
//                   { display: 'Maghrib', key: 'Maghrib' },
//                   { display: 'Isya', key: 'Isha' }
//                 ].map((item) => (
//                   <div key={item.display} className={`flex h-full items-center justify-between py-3 md:py-4 px-6 md:px-8 border-b shadow-sm transition-all ${isDarkMode ? 'bg-white/5 border-slate-800' : 'bg-white/50 border-slate-200'}`}>
//                     <span className={`text-xs md:text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-blue-400' : 'text-black'}`}>{item.display}</span>
//                     <span className={`text-lg md:text-xl font-black tabular-nums ${isDarkMode ? 'text-white' : 'text-blue-700'}`}>{sholatTimes[item.key]}</span>
//                   </div>
//                 ))
//               ) : (
//                 <div className="flex-1 flex items-center justify-center text-xs py-10">Memuat Jadwal...</div>
//               )}
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// /* --- SUB COMPONENTS --- */

// const CompactStat = ({ label, value, icon, bgColor, theme }: any) => (
//   <div className={`flex items-center justify-between px-5 md:px-8 py-3 md:py-4 border-b h-full shadow-sm transition-all ${theme ? 'bg-transparent border-slate-800' : 'bg-white border-slate-300'}`}>
//     <div className="flex items-center gap-3 md:gap-4">
//       <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl ${bgColor} shadow-sm scale-90 md:scale-100`}>
//         {icon}
//       </div>
//       <span className={`text-xs md:text-[14px] font-black uppercase tracking-widest ${theme ? 'text-slate-400' : 'text-black'}`}>{label}</span>
//     </div>
//     <span className={`text-2xl md:text-4xl font-black tabular-nums tracking-tight ${theme ? 'text-white' : 'text-slate-900'}`}>{value}</span>
//   </div>
// );

// const CollectionCard = ({ label, value, icon, theme }: any) => (
//   <div className={`flex flex-col items-center justify-center py-6 md:py-4 px-2 text-center relative transition-all border-r last:border-r-0 ${theme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
//     <div className="text-blue-500 mb-1 md:mb-2 scale-75 md:scale-100">
//       {icon}
//     </div>
//     <span className={`text-xl md:text-3xl font-black tabular-nums ${theme ? 'text-white' : 'text-slate-900'}`}>{value.toLocaleString()}</span>
//     <span className={`text-[8px] md:text-[9px] font-extrabold uppercase tracking-[0.1em] mt-1 ${theme ? 'text-slate-500' : 'text-black'}`}>{label}</span>
//   </div>
// );

// const YoutubeRotator = ({ videoIds, currentIndex, setIndex }: any) => {
//   const onEnd = () => setIndex((prev: number) => (prev + 1) % videoIds.length);
//   const onStateChange = (event: any) => { if (event.data === 2) event.target.playVideo(); };

//   return (
//     <div className="absolute inset-0 w-full h-full bg-black overflow-hidden pt-[40px] md:pt-0">
//       <YouTube 
//         videoId={videoIds[currentIndex]} 
//         opts={{
//           height: '100%',
//           width: '100%',
//           playerVars: { 
//             autoplay: 1, 
//             mute: 1, 
//             controls: 0, 
//             modestbranding: 1, 
//             rel: 0, 
//             iv_load_policy: 3,
//             disablekb: 1,
//           },
//         }} 
//         onEnd={onEnd}
//         onError={onEnd}
//         onStateChange={onStateChange}
//         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] md:w-[110%] md:h-[110%]"
//       />
//       <div className="absolute inset-0 z-50 bg-transparent" />
//     </div>
//   );
// };

// export default TVLayer;





// import { useSchool } from '@/features/schools';
// import axios from 'axios';
// import {
//   Calendar,
//   Cloud,
//   CloudFog,
//   CloudLightning,
//   CloudRain,
//   CloudSun,
//   LogIn,
//   LogOut,
//   MapPin,
//   Sun
// } from 'lucide-react';
// import { QRCodeSVG } from 'qrcode.react';
// import { useCallback, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import YouTube from 'react-youtube';

// const BASE_URL = "https://be-perpus.kiraproject.id";

// const TVLayer = () => {
//   const [videoList, setVideoList] = useState<string[]>([]);
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [sholatTimes, setSholatTimes] = useState<any>(null);
//   const [weather, setWeather] = useState({ temp: 30, description: 'Cerah', iconCode: 0 });
//   const [qrTab, setQrTab] = useState<'masuk' | 'pulang'>('masuk');

//   const navigate = useNavigate();
//   const schoolQuery = useSchool();
//   const SCHOOL_DATA = schoolQuery?.data?.[0];
//   const SCHOOL_ID = SCHOOL_DATA?.id;

//   const getYoutubeId = (url: string) => {
//     if (!url) return null;
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return (match && match[2].length === 11) ? match[2] : null;
//   };

//   const getWeatherIcon = (code: number) => {
//     if (code === 0) return <Sun size={32} className="text-yellow-400" />;
//     if (code >= 1 && code <= 3) return <CloudSun size={32} className="text-yellow-200" />;
//     if (code >= 45 && code <= 48) return <CloudFog size={32} className="text-slate-300" />;
//     if (code >= 51 && code <= 67) return <CloudRain size={32} className="text-blue-300" />;
//     if (code >= 95) return <CloudLightning size={32} className="text-yellow-500" />;
//     return <Cloud size={32} className="text-white" />;
//   };

//   const fetchData = useCallback(async () => {
//     if (!SCHOOL_ID) return;
//     try {
//       const resSholat = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
//         params: { city: 'Jakarta', country: 'Indonesia', method: 11 }
//       });
//       if (resSholat.data.code === 200) setSholatTimes(resSholat.data.data.timings);

//       const resWeather = await axios.get('https://api.open-meteo.com/v1/forecast', {
//         params: { latitude: -6.2088, longitude: 106.8456, current: 'temperature_2m,weather_code', timezone: 'Asia/Jakarta' }
//       });
//       if (resWeather.data.current) {
//         setWeather({
//           temp: Math.round(resWeather.data.current.temperature_2m),
//           description: resWeather.data.current.weather_code === 0 ? 'Cerah' : 'Berawan',
//           iconCode: resWeather.data.current.weather_code
//         });
//       }

//       const resSetting = await axios.get(`${BASE_URL}/setting?schoolId=${SCHOOL_ID}`);
//       if (resSetting.data.success) {
//         const { urlYoutube1, urlYoutube2, urlYoutube3 } = resSetting.data.data;
//         const ids = [urlYoutube1, urlYoutube2, urlYoutube3].map(url => getYoutubeId(url)).filter((id): id is string => id !== null);
//         setVideoList(ids);
//       }
//     } catch (err) { console.error(err); }
//   }, [SCHOOL_ID]);

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     fetchData();
//     const dataInterval = setInterval(fetchData, 600000);
//     return () => { clearInterval(timer); clearInterval(dataInterval); };
//   }, [fetchData]);

//   return (
//     <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-blue-900 to-blue-400 text-white overflow-hidden font-sans flex flex-col gap-2">
      
//       <div className="flex flex-1 min-h-0 gap-2">
        
//         {/* KOLOM KIRI (JAM, CUACA, QR) */}
//         <div className="w-[32%] max-w-[450px] flex flex-col gap-1 min-h-0">
          
//           {/* HEADER: JAM & CUACA */}
//           <div className="overflow-hidden shadow-xl flex items-center justify-between shrink-0 border-b-4 border-blue-900 h-[120px]">
//             <div className="bg-gradient-to-br from-slate-700 to-slate-400 flex w-full h-full p-4 justify-center items-center flex-col text-slate-900">
//               <h2 className="text-6xl font-black tabular-nums text-white tracking-tighter leading-none">
//                 {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
//               </h2>
//               <p className="text-[10px] text-white font-bold uppercase tracking-widest mt-1 opacity-80 flex items-center gap-2">
//                 <Calendar size={12} /> {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
//               </p>
//             </div>
            
//             <div className="relative bg-purple-700 flex space-y-1 w-full h-full px-4 justify-center items-center flex-col border-l border-white/10">
//               <div className="flex items-center gap-2">
//                 {getWeatherIcon(weather.iconCode)}
//                 <span className="text-6xl font-black tabular-nums tracking-tighter leading-none">{weather.temp}°C</span>
//               </div>
//               <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">Jakarta, ID</span>
//             </div>
//           </div>

//           {/* QR CODE INTERAKTIF */}
//           <div className="flex-1 bg-slate-900/60 border border-slate-800 p-6 flex flex-col items-center min-h-0 shadow-2xl">
//             <div className="relative h-max flex w-full bg-slate-800/80 mb-6 shrink-0">
//               <button onClick={() => setQrTab('masuk')} className={`flex-1 py-4 text-center font-black text-[11px] transition-all flex items-center justify-center gap-2 ${qrTab === 'masuk' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500'}`}>
//                 <LogIn size={14}/> MASUK
//               </button>
//               <button onClick={() => setQrTab('pulang')} className={`flex-1 py-4 text-center font-black text-[11px] transition-all flex items-center justify-center gap-2 ${qrTab === 'pulang' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500'}`}>
//                 <LogOut size={14}/> PULANG
//               </button>
//             </div>

//             <div className="flex-1 h-full flex flex-col items-center justify-center w-full min-h-0">
//                 {/* Kotak Putih Pembungkus QR */}
//                 <div className={`bg-white w-max p-3 h-full hadow-2xl aspect-square flex items-center justify-center border-4 rounded-xl ${qrTab === 'masuk' ? 'border-blue-500/30' : 'border-rose-500/30'}`}>
                  
//                   {/* QRCodeSVG tanpa 'size' statis, menggunakan className untuk kontrol ukuran */}
//                   <QRCodeSVG 
//                     value={`https://be-perpus.kiraproject.id/kehadiran?mode=${qrTab}&schoolId=${SCHOOL_ID}`} 
//                     // Hapus size={170} agar tidak terkunci di ukuran kecil
//                     style={{ width: '100%', height: '100%' }} 
//                     className="w-[100%] h-[100%]"
//                     level="H"
//                   />
//                 </div>
//               </div>
//           </div>
//         </div>

//         {/* KOLOM KANAN: VIDEO & INFO SEKOLAH */}
//         <div className="flex-1 flex flex-col gap-2 min-h-0">
//           {/* LAYAR YOUTUBE */}
//           <div className="flex-[3] bg-black overflow-hidden border border-slate-800 shadow-2xl relative">
//             {videoList.length > 0 ? (
//               <YoutubeRotator videoIds={videoList} currentIndex={currentVideoIndex} setIndex={setCurrentVideoIndex} />
//             ) : (
//               <div className="h-full w-full flex items-center justify-center bg-slate-900">
//                 <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//               </div>
//             )}
//           </div>

//           {/* SECTION BARU: INFO SEKOLAH */}
//           <div className="flex-1 bg-slate-900/80 border border-slate-800  text-center py-4 px-6 flex items-center justify-between gap-6 shadow-xl relative overflow-hidden">
//             {/* Logo Sekolah (Kiri) */}
//             <div className="shrink-0 bg-white p-2 rounded-lg shadow-md">
//               <img src="/logo-sekolah.png" alt="Logo Sekolah" className="h-16 w-16 object-contain" onError={(e:any) => e.target.src = "https://via.placeholder.com/64?text=LOGO"} />
//             </div>

//             {/* Konten Teks (Tengah) */}
//             <div className="flex-1 text-center min-w-0">
//               <h1 className="text-3xl font-black uppercase text-purple-500 truncate leading-tight">
//                 {SCHOOL_DATA?.name || "Perpustakaan Sekolah"}
//               </h1>
//               <div className="flex flex-col mx-auto w-full items-center justify-center mt-4 gap-4">
//                 <p className="flex items-center gap-1 text-md font-medium text-slate-300 italic shrink-0">
//                   "Cerdas, Beretika, dan Berbudaya Membaca"
//                 </p>
//                 <p className="flex items-center gap-1 text-md text-slate-400 truncate">
//                   <MapPin size={12} className="text-rose-500" /> 
//                   Jl. Pendidikan No. 123, Jakarta Selatan, DKI Jakarta
//                 </p>
//               </div>
//             </div>

//             {/* Logo Dinas (Kanan) */}
//             <div className="shrink-0 bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/5">
//               <img src="/logo-sekolah.png" alt="Logo Dinas" className="h-16 w-16 object-contain" onError={(e:any) => e.target.src = "https://upload.wikimedia.org/wikipedia/commons/b/b2/Tut_Wuri_Handayani.png"} />
//             </div>
//           </div>
//         </div>
//       </div>

//      {/* FOOTER: JADWAL SHOLAT DENGAN WARNA BERBEDA */}
//       <div className="h-max flex p-0 items-center">
//         <div className="w-full gap-x-4 grid grid-cols-5">
//           {sholatTimes ? (
//             ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((key, index) => {
//               const labels: any = { Fajr: 'Subuh', Dhuhr: 'Dzuhur', Asr: 'Ashar', Maghrib: 'Maghrib', Isha: 'Isya' };
              
//               // Urutan warna Gradient: biru tua, merah, cyan, hijau muda, orange
//               const gradients = [
//                 'from-blue-900 to-blue-700',      // Subuh (Biru Tua)
//                 'from-red-900 to-red-600',       // Dzuhur (Merah)
//                 'from-cyan-900 to-cyan-600',     // Ashar (Cyan)
//                 'from-green-900 to-green-600',   // Maghrib (Hijau)
//                 'from-orange-800 to-orange-500', // Isya (Orange)
//               ];

//               return (
//                 <div 
//                   key={key} 
//                   className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${gradients[index]} p-6 border-t border-white/20 shadow-lg`}
//                 >
//                   <span className="text-[12px] font-bold text-white/80 uppercase tracking-[0.2em] mb-2">
//                     {labels[key]}
//                   </span>
//                   <span className="text-6xl font-black text-white tabular-nums tracking-tighter drop-shadow-md">
//                     {sholatTimes[key]}
//                   </span>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="w-full text-center">
//               <p className="text-slate-500 text-xl animate-pulse italic uppercase tracking-widest">
//                 Syncing Prayer Times...
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const YoutubeRotator = ({ videoIds, currentIndex, setIndex }: any) => {
//   const onEnd = () => setIndex((prev: number) => (prev + 1) % videoIds.length);
//   return (
//     <div className="absolute inset-0 w-full h-full">
//       <YouTube 
//         videoId={videoIds[currentIndex]} 
//         opts={{ height: '100%', width: '100%', playerVars: { autoplay: 1, mute: 1, controls: 0, modestbranding: 1, rel: 0 } }} 
//         onEnd={onEnd} onError={onEnd}
//         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[101%] h-[101%]"
//       />
//       <div className="absolute inset-0 z-50 pointer-events-none" />
//     </div>
//   );
// };

// export default TVLayer;



import { useSchool } from '@/features/schools';
import axios from 'axios';
import {
  Calendar,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  LogIn,
  LogOut,
  MapPin,
  Sun
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';

const BASE_URL = "https://be-perpus.kiraproject.id";

const TVLayer = () => {
  const [videoList, setVideoList] = useState<string[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sholatTimes, setSholatTimes] = useState<any>(null);
  const [weather, setWeather] = useState({ temp: 30, description: 'Cerah', iconCode: 0 });
  const [qrTab, setQrTab] = useState<'masuk' | 'pulang'>('masuk');

  const navigate = useNavigate();
  const schoolQuery = useSchool();
  const SCHOOL_DATA = schoolQuery?.data?.[0];
  const SCHOOL_ID = SCHOOL_DATA?.id;

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun size={32} className="text-yellow-400" />;
    if (code >= 1 && code <= 3) return <CloudSun size={32} className="text-yellow-200" />;
    if (code >= 45 && code <= 48) return <CloudFog size={32} className="text-slate-300" />;
    if (code >= 51 && code <= 67) return <CloudRain size={32} className="text-blue-300" />;
    if (code >= 95) return <CloudLightning size={32} className="text-yellow-500" />;
    return <Cloud size={32} className="text-white" />;
  };

  const fetchData = useCallback(async () => {
    if (!SCHOOL_ID) return;
    try {
      const resSholat = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
        params: { city: 'Jakarta', country: 'Indonesia', method: 11 }
      });
      if (resSholat.data.code === 200) setSholatTimes(resSholat.data.data.timings);

      const resWeather = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: { latitude: -6.2088, longitude: 106.8456, current: 'temperature_2m,weather_code', timezone: 'Asia/Jakarta' }
      });
      if (resWeather.data.current) {
        setWeather({
          temp: Math.round(resWeather.data.current.temperature_2m),
          description: resWeather.data.current.weather_code === 0 ? 'Cerah' : 'Berawan',
          iconCode: resWeather.data.current.weather_code
        });
      }

      const resSetting = await axios.get(`${BASE_URL}/setting?schoolId=${SCHOOL_ID}`);
      if (resSetting.data.success) {
        const { urlYoutube1, urlYoutube2, urlYoutube3 } = resSetting.data.data;
        const ids = [urlYoutube1, urlYoutube2, urlYoutube3].map(url => getYoutubeId(url)).filter((id): id is string => id !== null);
        setVideoList(ids);
      }
    } catch (err) { console.error(err); }
  }, [SCHOOL_ID]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchData();
    const dataInterval = setInterval(fetchData, 600000);
    return () => { clearInterval(timer); clearInterval(dataInterval); };
  }, [fetchData]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-blue-900 to-blue-400 text-white overflow-hidden font-sans flex flex-col gap-2">
      
      <div className="flex flex-1 min-h-0 gap-2">
        
        {/* KOLOM KIRI (JAM, CUACA, QR) */}
        <div className="w-[32%] max-w-[450px] flex flex-col gap-1 min-h-0">
          
          {/* HEADER: JAM & CUACA */}
          <div className="overflow-hidden shadow-xl flex items-center justify-between shrink-0 border-b-4 border-blue-900 h-[120px]">
            <div className="bg-gradient-to-br from-slate-700 to-slate-400 flex w-full h-full p-4 justify-center items-center flex-col text-slate-900">
              <h2 className="text-6xl font-black tabular-nums text-white tracking-tighter leading-none">
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </h2>
              <p className="text-[10px] text-white font-bold uppercase tracking-widest mt-1 opacity-80 flex items-center gap-2">
                <Calendar size={12} /> {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
              </p>
            </div>
            
            <div className="relative bg-purple-700 flex space-y-1 w-full h-full px-4 justify-center items-center flex-col border-l border-white/10">
              <div className="flex items-center gap-2">
                {getWeatherIcon(weather.iconCode)}
                <span className="text-6xl font-black tabular-nums tracking-tighter leading-none">{weather.temp}°C</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">Jakarta, ID</span>
            </div>
          </div>

          {/* QR CODE INTERAKTIF */}
          <div className="flex-1 bg-slate-900/60 border border-slate-800 p-6 flex flex-col items-center min-h-0 shadow-2xl">
            <div className="relative h-max flex w-full bg-slate-800/80 mb-6 shrink-0">
              <button onClick={() => setQrTab('masuk')} className={`flex-1 py-4 text-center font-black text-[11px] transition-all flex items-center justify-center gap-2 ${qrTab === 'masuk' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500'}`}>
                <LogIn size={14}/> MASUK
              </button>
              <button onClick={() => setQrTab('pulang')} className={`flex-1 py-4 text-center font-black text-[11px] transition-all flex items-center justify-center gap-2 ${qrTab === 'pulang' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500'}`}>
                <LogOut size={14}/> PULANG
              </button>
            </div>

            <div className="flex-1 h-full flex flex-col items-center justify-center w-full min-h-0">
                {/* Kotak Putih Pembungkus QR */}
                <div className={`bg-white w-max p-3 h-full hadow-2xl aspect-square flex items-center justify-center border-4 rounded-xl ${qrTab === 'masuk' ? 'border-blue-500/30' : 'border-rose-500/30'}`}>
                  
                  {/* QRCodeSVG tanpa 'size' statis, menggunakan className untuk kontrol ukuran */}
                  <QRCodeSVG 
                    value={`https://be-perpus.kiraproject.id/peminjam/kehadiran?mode=${qrTab}&schoolId=${SCHOOL_ID}`} 
                    // Hapus size={170} agar tidak terkunci di ukuran kecil
                    style={{ width: '100%', height: '100%' }} 
                    className="w-[100%] h-[100%]"
                    level="H"
                  />
                </div>
              </div>
          </div>
        </div>

        {/* KOLOM KANAN: VIDEO & INFO SEKOLAH */}
        <div className="flex-1 flex flex-col gap-2 min-h-0">
          {/* LAYAR YOUTUBE */}
          <div className="flex-[3] bg-black overflow-hidden border border-slate-800 shadow-2xl relative">
            {videoList.length > 0 ? (
              <YoutubeRotator videoIds={videoList} currentIndex={currentVideoIndex} setIndex={setCurrentVideoIndex} />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-slate-900">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* SECTION BARU: INFO SEKOLAH */}
          <div className="flex-1 bg-slate-900/80 border border-slate-800  text-center py-4 px-6 flex items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            {/* Logo Sekolah (Kiri) */}
            <div className="shrink-0 bg-white p-2 rounded-lg shadow-md">
              <img src="/logo-sekolah.png" alt="Logo Sekolah" className="h-16 w-16 object-contain" onError={(e:any) => e.target.src = "https://via.placeholder.com/64?text=LOGO"} />
            </div>

            {/* Konten Teks (Tengah) */}
            <div className="flex-1 text-center min-w-0">
              <h1 className="text-3xl font-black uppercase text-purple-500 truncate leading-tight">
                {SCHOOL_DATA?.name || "Perpustakaan Sekolah"}
              </h1>
              <div className="flex flex-col mx-auto w-full items-center justify-center mt-4 gap-4">
                <p className="flex items-center gap-1 text-md font-medium text-slate-300 italic shrink-0">
                  "Cerdas, Beretika, dan Berbudaya Membaca"
                </p>
                <p className="flex items-center gap-1 text-md text-slate-400 truncate">
                  <MapPin size={12} className="text-rose-500" /> 
                  Jl. Pendidikan No. 123, Jakarta Selatan, DKI Jakarta
                </p>
              </div>
            </div>

            {/* Logo Dinas (Kanan) */}
            <div className="shrink-0 bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/5">
              <img src="/logo-sekolah.png" alt="Logo Dinas" className="h-16 w-16 object-contain" onError={(e:any) => e.target.src = "https://upload.wikimedia.org/wikipedia/commons/b/b2/Tut_Wuri_Handayani.png"} />
            </div>
          </div>
        </div>
      </div>

     {/* FOOTER: JADWAL SHOLAT DENGAN WARNA BERBEDA */}
      <div className="h-max flex p-0 items-center">
        <div className="w-full gap-x-4 grid grid-cols-5">
          {sholatTimes ? (
            ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((key, index) => {
              const labels: any = { Fajr: 'Subuh', Dhuhr: 'Dzuhur', Asr: 'Ashar', Maghrib: 'Maghrib', Isha: 'Isya' };
              
              // Urutan warna Gradient: biru tua, merah, cyan, hijau muda, orange
              const gradients = [
                'from-blue-900 to-blue-700',      // Subuh (Biru Tua)
                'from-red-900 to-red-600',       // Dzuhur (Merah)
                'from-cyan-900 to-cyan-600',     // Ashar (Cyan)
                'from-green-900 to-green-600',   // Maghrib (Hijau)
                'from-orange-800 to-orange-500', // Isya (Orange)
              ];

              return (
                <div 
                  key={key} 
                  className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${gradients[index]} p-6 border-t border-white/20 shadow-lg`}
                >
                  <span className="text-[12px] font-bold text-white/80 uppercase tracking-[0.2em] mb-2">
                    {labels[key]}
                  </span>
                  <span className="text-6xl font-black text-white tabular-nums tracking-tighter drop-shadow-md">
                    {sholatTimes[key]}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="w-full text-center">
              <p className="text-slate-500 text-xl animate-pulse italic uppercase tracking-widest">
                Syncing Prayer Times...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const YoutubeRotator = ({ videoIds, currentIndex, setIndex }: any) => {
  const onEnd = () => setIndex((prev: number) => (prev + 1) % videoIds.length);
  return (
    <div className="absolute inset-0 w-full h-full">
      <YouTube 
        videoId={videoIds[currentIndex]} 
        opts={{ height: '100%', width: '100%', playerVars: { autoplay: 1, mute: 1, controls: 0, modestbranding: 1, rel: 0 } }} 
        onEnd={onEnd} onError={onEnd}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[101%] h-[101%]"
      />
      <div className="absolute inset-0 z-50 pointer-events-none" />
    </div>
  );
};

export default TVLayer;