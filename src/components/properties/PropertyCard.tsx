import { Link } from "react-router";
import { Heart, BadgeCheck, Phone, MapPin, Grid, BedDouble, Bath, Sun, ShieldCheck } from "lucide-react";
import { Property } from "../../types";

export default function PropertyCard({ property }: { property: Property }) {
  // Format price smartly for Syrian currency (Millions / Billions)
  const formatSyrianPrice = (price: number) => {
    if (price >= 1_000_000_000) {
      const billions = price / 1_000_000_000;
      return `${Number.isInteger(billions) ? billions : billions.toFixed(1)} مليار`;
    }
    if (price >= 1_000_000) {
      const millions = price / 1_000_000;
      return `${Number.isInteger(millions) ? millions : millions.toFixed(1)} مليون`;
    }
    if (price >= 1_000) {
      return `${(price / 1000).toFixed(0)} ألف`;
    }
    return new Intl.NumberFormat('ar-SY').format(price);
  };

  const getCategoryInfo = () => {
    switch (property.category) {
      case 'houses':
      case 'sale':
      case 'rent':
      case 'furnished':
      case 'damascene_house':
        return { label: 'بيوت', bg: 'bg-blue-600 text-white' };
      case 'buildings':
        return { label: 'بنايات', bg: 'bg-slate-800 text-white' };
      case 'farms':
        return { label: 'مزارع', bg: 'bg-emerald-700 text-white' };
      case 'lands':
      case 'land':
        return { label: 'أراضي', bg: 'bg-stone-700 text-white' };
      case 'shops':
      case 'commercial':
        return { label: 'محلات', bg: 'bg-purple-700 text-white' };
      case 'villas':
      case 'villa_farm':
        return { label: 'فلل', bg: 'bg-amber-600 text-white' };
      case 'factories':
        return { label: 'مصانع', bg: 'bg-orange-700 text-white' };
      case 'other':
      case 'chalet':
      case 'student':
      case 'offplan':
        return { label: 'أخرى', bg: 'bg-indigo-600 text-white' };
      default: 
        return { label: property.type === 'sale' ? 'للبيع' : 'للإيجار', bg: 'bg-slate-900 text-white' };
    }
  };

  const catInfo = getCategoryInfo();

  return (
    <div className="card flex flex-col overflow-hidden hover:shadow-lg transition-all duration-200 bg-white border border-slate-200/90 rounded-2xl group">
      <Link to={`/property/${property.id}`} className="relative block h-[180px] sm:h-[200px] overflow-hidden bg-slate-100">
        <img 
          src={property.images[0]} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80';
          }}
        />
        
        {/* Top Badges */}
        <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1.5 z-10">
          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold shadow-xs ${catInfo.bg}`}>
            {catInfo.label}
          </span>

          {property.isVerified && (
            <div className="bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs">
              <BadgeCheck className="w-3 h-3" />
              <span>موثوق</span>
            </div>
          )}
        </div>
        
        <div className="absolute top-2.5 left-2.5 z-10">
          <button 
            type="button" 
            onClick={(e) => { e.preventDefault(); }} 
            className="bg-white/90 p-1.5 rounded-full hover:bg-white transition-colors shadow-xs text-slate-400 hover:text-red-500"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {property.ownershipType?.includes('طابو أخضر') && (
            <div className="bg-blue-600/95 text-white px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-xs">
              <ShieldCheck className="w-3 h-3" />
              <span>طابو أخضر</span>
            </div>
          )}
        </div>

        <div className="absolute bottom-2.5 left-2.5 bg-black/60 text-white px-2 py-0.5 rounded-md text-[10px] font-medium backdrop-blur-xs flex items-center gap-1">
          <Grid className="w-3 h-3" />
          <span>{property.images.length}</span>
        </div>
      </Link>

      <div className="p-3.5 flex flex-col flex-1">
        <Link to={`/property/${property.id}`} className="block">
          <div className="flex items-baseline justify-between gap-1 mb-1">
            <div className="flex items-baseline gap-1">
              <span className="text-base md:text-lg font-black text-brand-600">
                {formatSyrianPrice(property.price)}
              </span>
              <span className="text-xs font-bold text-slate-600">ل.س</span>
              {property.pricePeriod && (
                <span className="text-[10px] text-slate-500 font-bold">/ {property.pricePeriod}</span>
              )}
            </div>

            {property.priceInUSD && (
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                ${property.priceInUSD.toLocaleString()}
              </span>
            )}
          </div>
          
          <h3 className="text-xs md:text-sm font-bold text-slate-900 line-clamp-1 mb-2 hover:text-brand-600 transition-colors">
            {property.title}
          </h3>
          
          <div className="flex items-center gap-3 text-xs text-slate-600 mb-2.5 border-b border-slate-100 pb-2.5 font-medium">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.bedrooms} غرف</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.bathrooms} حمام</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Grid className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.area} م²</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-3 truncate font-medium">
            <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </Link>
        
        <div className="mt-auto grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
          <a 
            href={`tel:${property.agent.phone}`} 
            className="flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl py-2 text-xs font-bold transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-slate-600" />
            <span>اتصال</span>
          </a>
          <a 
            href={`https://wa.me/${property.agent.whatsapp}?text=${encodeURIComponent(`مرحباً، بخصوص إعلان العقار على تطبيق لقطة: ${property.title} (${property.location})`)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl py-2 text-xs font-bold transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-emerald-600">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>واتساب</span>
          </a>
        </div>
      </div>
    </div>
  );
}
