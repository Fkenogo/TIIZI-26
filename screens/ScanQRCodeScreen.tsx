
import React from 'react';
import { AppView } from '../types';

interface Props {
  onNavigate: (view: AppView) => void;
}

const ScanQRCodeScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-black text-white font-display flex flex-col antialiased overflow-hidden">
      {/* Header */}
      <header className="p-6 pt-12 flex items-center justify-between absolute top-0 w-full z-50">
        <button 
          onClick={() => onNavigate(AppView.DISCOVER)}
          className="size-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center active:scale-90 transition-all"
        >
          <span className="material-symbols-rounded text-2xl">arrow_back</span>
        </button>
        <h2 className="text-base font-black uppercase tracking-widest shadow-sm">Scan QR Code</h2>
        <button className="size-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
          <span className="material-symbols-rounded text-2xl">flashlight_on</span>
        </button>
      </header>

      {/* Viewfinder Container */}
      <main className="flex-1 flex flex-col items-center justify-center relative p-10">
        <div className="relative w-full max-w-[320px] aspect-square">
          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 size-16 border-t-4 border-l-4 border-primary rounded-tl-[32px]"></div>
          <div className="absolute top-0 right-0 size-16 border-t-4 border-r-4 border-primary rounded-tr-[32px]"></div>
          <div className="absolute bottom-0 left-0 size-16 border-b-4 border-l-4 border-primary rounded-bl-[32px]"></div>
          <div className="absolute bottom-0 right-0 size-16 border-b-4 border-r-4 border-primary rounded-br-[32px]"></div>
          
          {/* Scan Line Animation */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_15px_#D36D21] animate-[scan_3s_ease-in-out_infinite]"></div>

          {/* Central Camera Icon */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
             <div className="size-20 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-md opacity-20 border border-white/10">
               <span className="material-symbols-rounded text-5xl">photo_camera</span>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Camera Viewfinder Active</p>
          </div>
        </div>

        <div className="mt-20 text-center space-y-12 max-w-[280px]">
           <p className="text-sm font-bold opacity-80 leading-relaxed">
             Point your camera at a Tiizi Group QR code to join instantly.
           </p>

           <div className="flex justify-center gap-6">
              <button className="size-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all border border-white/10">
                 <span className="material-symbols-rounded text-2xl">zoom_in</span>
              </button>
              <button 
                onClick={() => onNavigate(AppView.GROUP_JOIN_SHEET)}
                className="size-20 rounded-[28px] bg-primary flex items-center justify-center shadow-2xl shadow-primary/30 active:scale-95 transition-all border-4 border-white/10"
              >
                 <span className="material-symbols-rounded text-3xl font-black">qr_code_2</span>
              </button>
              <button className="size-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all border border-white/10">
                 <span className="material-symbols-rounded text-2xl">history</span>
              </button>
           </div>
        </div>
      </main>

      {/* Footer Upload */}
      <footer className="p-8 flex justify-center pb-12">
         <button className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all">
           <span className="material-symbols-rounded text-base">image</span>
           Upload from Gallery
         </button>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0%, 100% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; }
        }
      `}} />
    </div>
  );
};

export default ScanQRCodeScreen;
