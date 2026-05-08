export default function FeatureCard({ icon, title, desc, onClick }: any) {
  return (
    <div
      onClick={() => {
        console.log("Card " + title + " diklik!");
        if (onClick) onClick();
      }}
      className="group p-10 bg-white rounded-[3rem] border border-slate-100 hover:border-emerald-200 hover:shadow-2xl transition-all cursor-pointer relative z-10"
    >
      <div className="text-5xl mb-8 group-hover:scale-110 transition-transform inline-block">
        {icon}
      </div>
      <h4 className="text-xl font-black text-slate-800 mb-3 uppercase italic">
        {title}
      </h4>
      <p className="text-sm text-slate-500 font-medium leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
